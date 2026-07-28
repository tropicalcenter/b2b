/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Conexão com o Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oxvrjboqekzhnzhrajxn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fz-xTvCXlIK6A_QZSKXZ3Q_M5xcyDPE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
