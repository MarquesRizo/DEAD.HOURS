'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { SkillItem, filterSkills, normalizeSkillText } from '@/lib/skillsData';
import { tacticalAudio } from '@/lib/audioSynthesis';
import { Search, ChevronDown, AlertCircle } from 'lucide-react';

interface SkillAutocompleteProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function SkillAutocomplete({
  id,
  name,
  value,
  onChange,
  placeholder = 'Digite ou selecione uma perícia...',
  label,
}: SkillAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Filtra as perícias em tempo real baseado no valor controlado
  const filteredSkills = filterSkills(value || '');

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Rola o item focado para a visualização ao usar as setas
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const items = listboxRef.current.querySelectorAll('li');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleSelectSkill = (skill: SkillItem) => {
    tacticalAudio.playTacticalClick();
    // Formata como a perícia oficial com indicador de atributo para clareza
    const formatted = `${skill.nome} (+2 em ${skill.atributoNome})`;
    onChange(formatted);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSkills.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSkills.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSkills[highlightedIndex]) {
        handleSelectSkill(filteredSkills[highlightedIndex]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // Helper para destacar o trecho pesquisado
  const renderHighlightedName = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const normQuery = normalizeSkillText(query);
    const normText = normalizeSkillText(text);
    const matchIndex = normText.indexOf(normQuery);

    if (matchIndex === -1) return text;

    const before = text.slice(0, matchIndex);
    const match = text.slice(matchIndex, matchIndex + query.length);
    const after = text.slice(matchIndex + query.length);

    return (
      <span>
        {before}
        <mark className="bg-[#781D24] text-white font-bold px-0.5 rounded-none">{match}</mark>
        {after}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative space-y-1 font-mono-tech text-xs">
      {label && (
        <label htmlFor={id} className="text-[#77736C] block flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-[#781D24]">+2 NO ATRIBUTO</span>
        </label>
      )}

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={value || ''}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 pr-8 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            tacticalAudio.playTacticalClick();
            setIsOpen((prev) => !prev);
            if (!isOpen) {
              inputRef.current?.focus();
            }
          }}
          className="absolute right-1 p-1 text-[#77736C] hover:text-[#E3DED3] transition-colors"
          title="Ver perícias homologadas"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-[#781D24]' : ''}`} />
        </button>
      </div>

      {/* Dropdown de Sugestões Tático */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#121212] border-2 border-[#781D24] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-64 flex flex-col">
          <div className="bg-[#1A1A1A] px-2.5 py-1.5 border-b border-[#2B2B2B] flex items-center justify-between text-[10px] text-[#77736C]">
            <span className="flex items-center gap-1 text-[#C3BBA9]">
              <Search className="w-3 h-3 text-[#781D24]" />
              PERÍCIAS HOMOLOGADAS ({filteredSkills.length})
            </span>
            <span>SETAS // ENTER SELECIONA</span>
          </div>

          <ul
            id={listboxId}
            ref={listboxRef}
            role="listbox"
            className="overflow-y-auto divide-y divide-[#1F1F1F] text-xs"
          >
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill, index) => {
                const isSelected = highlightedIndex === index;
                return (
                  <li
                    key={skill.id}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelectSkill(skill)}
                    className={`px-3 py-2 cursor-pointer transition-colors flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#231215] text-white border-l-2 border-[#781D24]'
                        : 'text-[#C3BBA9] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold flex items-center gap-1.5 text-[#E3DED3]">
                        <span>{renderHighlightedName(skill.nome, value || '')}</span>
                        <span className="text-[10px] px-1 py-0.2 bg-[#781D24]/30 text-[#AA2830] border border-[#781D24]/60">
                          {skill.atributo}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#77736C] line-clamp-1">
                        {skill.descricao}
                      </div>
                    </div>

                    <div className="text-[10px] text-right shrink-0 pt-0.5">
                      <span className="text-[#C3BBA9] font-bold">+2 em {skill.atributoNome}</span>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="p-4 text-center space-y-1.5 text-[#77736C]">
                <AlertCircle className="w-5 h-5 mx-auto text-[#781D24]" />
                <div className="text-[#E3DED3] font-bold">NENHUMA PERÍCIA OFICIAL CORRESPONDENTE</div>
                <div className="text-[10px] text-[#77736C]">
                  Você pode manter o texto personalizado digitado. O sistema aceita especializações livres do sobrevivente.
                </div>
              </li>
            )}
          </ul>

          <div className="bg-[#0B0B0B] px-2.5 py-1 text-[9px] text-[#555555] border-t border-[#1F1F1F] flex items-center justify-between">
            <span>DIGITE ESC PARA FECHAR</span>
            <span>EDIÇÃO 1.0 // SISTEMA DEAD HOURS</span>
          </div>
        </div>
      )}
    </div>
  );
}
