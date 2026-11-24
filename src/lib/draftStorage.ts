import { FichaData } from './exportFicha';

const DB_NAME = 'DeadHours_DB';
const DB_VERSION = 1;
const STORE_NAME = 'survivor_drafts';
const DRAFT_KEY = 'active_survivor_draft';
const FALLBACK_LOCAL_KEY = 'deadhours_ficha_draft_backup';

export interface SavedDraft {
  id: string;
  data: FichaData;
  updatedAt: string;
}

/**
 * Inicializa a conexão com o IndexedDB do navegador.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB não suportado neste ambiente.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Salva o rascunho completo da ficha no IndexedDB (ou localStorage como fallback seguro).
 */
export async function saveDraft(data: FichaData): Promise<{ success: boolean; updatedAt: string }> {
  const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const record: SavedDraft = {
    id: DRAFT_KEY,
    data,
    updatedAt: timestamp,
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    return { success: true, updatedAt: timestamp };
  } catch (idbErr) {
    console.warn('IndexedDB indisponível, utilizando localStorage como contingência:', idbErr);
    try {
      localStorage.setItem(FALLBACK_LOCAL_KEY, JSON.stringify(record));
      return { success: true, updatedAt: timestamp };
    } catch (lsErr) {
      console.error('Falha crítica ao gravar rascunho localmente:', lsErr);
      return { success: false, updatedAt: timestamp };
    }
  }
}

/**
 * Carrega o rascunho previamente salvo do IndexedDB ou do fallback localStorage.
 */
export async function loadDraft(): Promise<SavedDraft | null> {
  try {
    const db = await openDB();
    return await new Promise<SavedDraft | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(DRAFT_KEY);

      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const item = localStorage.getItem(FALLBACK_LOCAL_KEY);
      if (item) {
        return JSON.parse(item) as SavedDraft;
      }
    } catch {
      // Ignora erro no localStorage
    }
    return null;
  }
}

/**
 * Descarta o rascunho atual para iniciar um novo registro do zero.
 */
export async function clearDraft(): Promise<boolean> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(DRAFT_KEY);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Prossegue mesmo se falhar no IndexedDB
  }

  try {
    localStorage.removeItem(FALLBACK_LOCAL_KEY);
  } catch {
    // Ignora
  }

  return true;
}
