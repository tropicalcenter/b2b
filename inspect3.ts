import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxvrjboqekzhnzhrajxn.supabase.co';
const supabaseAnonKey = 'sb_publishable_fz-xTvCXlIK6A_QZSKXZ3Q_M5xcyDPE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  const tables = ['usuarios', 'pontos', 'historico', 'transactions', 'points_history', 'customers', 'empresas', 'admin'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (!error) console.log('Found table:', t);
  }
  console.log('done');
}

inspect();
