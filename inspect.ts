import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxvrjboqekzhnzhrajxn.supabase.co';
const supabaseAnonKey = 'sb_publishable_fz-xTvCXlIK6A_QZSKXZ3Q_M5xcyDPE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  const { data, error } = await supabase.from('clientes').select('*').limit(1);
  console.log('clientes:', data, error);
  
  const { data: d2, error: e2 } = await supabase.from('users').select('*').limit(1);
  console.log('users:', d2, e2);
  
  const { data: d3, error: e3 } = await supabase.from('profiles').select('*').limit(1);
  console.log('profiles:', d3, e3);
}

inspect();
