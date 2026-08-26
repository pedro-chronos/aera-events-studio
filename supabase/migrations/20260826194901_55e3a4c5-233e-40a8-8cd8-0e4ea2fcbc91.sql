CREATE TYPE public.aera_tipo_evento AS ENUM ('aniversario', 'marca', 'outro');
CREATE TYPE public.aera_pacote AS ENUM ('sala_exclusiva', 'lounge', 'indeciso');
CREATE TYPE public.aera_lead_status AS ENUM ('novo', 'em_contato', 'fechado', 'perdido');

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 2 AND 120),
  whatsapp text NOT NULL CHECK (whatsapp ~ '^[0-9]{10,13}$'),
  email text CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  tipo_evento public.aera_tipo_evento NOT NULL DEFAULT 'aniversario',
  pacote_interesse public.aera_pacote NOT NULL DEFAULT 'indeciso',
  numero_convidados int CHECK (numero_convidados IS NULL OR numero_convidados BETWEEN 1 AND 30),
  data_desejada date,
  mensagem text CHECK (mensagem IS NULL OR char_length(mensagem) <= 800),
  origem_secao text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_hash text,
  status public.aera_lead_status NOT NULL DEFAULT 'novo'
);

CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_status_idx ON public.leads (status);
CREATE INDEX leads_whatsapp_idx ON public.leads (whatsapp);
CREATE INDEX leads_ip_hash_created_at_idx ON public.leads (ip_hash, created_at DESC);

GRANT SELECT, UPDATE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipe logada pode ler leads"
  ON public.leads FOR SELECT TO authenticated USING (true);

CREATE POLICY "Equipe logada pode atualizar leads"
  ON public.leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.datas_indisponiveis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  data date NOT NULL UNIQUE,
  motivo text CHECK (motivo IS NULL OR char_length(motivo) <= 200)
);

CREATE INDEX datas_indisponiveis_data_idx ON public.datas_indisponiveis (data);

GRANT SELECT ON public.datas_indisponiveis TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.datas_indisponiveis TO authenticated;
GRANT ALL ON public.datas_indisponiveis TO service_role;

ALTER TABLE public.datas_indisponiveis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Datas indisponiveis sao publicas para leitura"
  ON public.datas_indisponiveis FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Equipe logada gerencia datas indisponiveis"
  ON public.datas_indisponiveis FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Equipe logada atualiza datas indisponiveis"
  ON public.datas_indisponiveis FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Equipe logada remove datas indisponiveis"
  ON public.datas_indisponiveis FOR DELETE TO authenticated USING (true);