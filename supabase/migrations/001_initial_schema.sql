-- ============================================================
-- LINHA RETA TURISMO — Schema inicial do Supabase
-- Migration: 001_initial_schema
-- ============================================================

-- Extensão para UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- DESTINATIONS — Catálogo de destinos e pacotes
-- ============================================================
create table public.destinations (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  short_description   text,
  long_description    text,
  category            text check (category in ('nordeste', 'nacional', 'internacional', 'cruzeiro')) default 'nordeste',
  cover_image_url     text,
  gallery_urls        text[] default '{}',
  base_price          decimal(10,2),
  promotion_price     decimal(10,2),
  promotion_end_date  timestamptz,
  duration_days       integer,
  includes            text[] default '{}',
  not_includes        text[] default '{}',
  highlights          text[] default '{}',
  whatsapp_message    text,
  status              text check (status in ('active', 'inactive', 'promotion')) default 'active',
  sort_order          integer default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ============================================================
-- POSTS — Blog para SEO
-- ============================================================
create table public.posts (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  title               text not null,
  excerpt             text,
  content             jsonb,                          -- Tiptap JSON
  cover_image_url     text,
  category            text,
  tags                text[] default '{}',
  meta_title          text,
  meta_description    text,
  og_image_url        text,
  status              text check (status in ('draft', 'published', 'archived')) default 'draft',
  reading_time_min    integer,
  published_at        timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ============================================================
-- LEADS — Contatos via formulário e páginas de destino
-- ============================================================
create table public.leads (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  phone           text,
  message         text,
  destination_id  uuid references public.destinations(id) on delete set null,
  source          text check (source in ('contact_form', 'destination_page', 'blog', 'capture_page')) default 'contact_form',
  status          text check (status in ('new', 'contacted', 'converted', 'lost')) default 'new',
  admin_notes     text,
  created_at      timestamptz default now()
);

-- ============================================================
-- SUBSCRIBERS — Lista de email marketing
-- ============================================================
create table public.subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text unique not null,
  name              text,
  is_subscribed     boolean default true,
  unsubscribe_token uuid default gen_random_uuid(),
  source            text check (source in ('capture_page', 'contact_form', 'blog', 'manual')) default 'capture_page',
  subscribed_at     timestamptz default now(),
  unsubscribed_at   timestamptz
);

-- ============================================================
-- EMAIL_CAMPAIGNS — Campanhas de email marketing
-- ============================================================
create table public.email_campaigns (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  subject          text not null,
  preview_text     text,
  blocks           jsonb default '[]',              -- Block-based editor content
  html_content     text,                            -- Rendered HTML para envio
  status           text check (status in ('draft', 'scheduled', 'sending', 'sent', 'paused')) default 'draft',
  scheduled_at     timestamptz,
  sent_at          timestamptz,
  recipient_count  integer default 0,
  open_count       integer default 0,
  click_count      integer default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ============================================================
-- PROMOTIONS — Promoções independentes dos destinos
-- ============================================================
create table public.promotions (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  description         text,
  destination_id      uuid references public.destinations(id) on delete cascade,
  discount_type       text check (discount_type in ('percentage', 'fixed')) default 'percentage',
  original_price      decimal(10,2),
  promotional_price   decimal(10,2),
  badge_text          text default 'OFERTA',
  is_active           boolean default true,
  start_date          timestamptz default now(),
  end_date            timestamptz,
  created_at          timestamptz default now()
);

-- ============================================================
-- TESTIMONIALS — Depoimentos de clientes
-- ============================================================
create table public.testimonials (
  id                  uuid primary key default gen_random_uuid(),
  client_name         text not null,
  destination_visited text,
  rating              integer check (rating >= 1 and rating <= 5) default 5,
  content             text not null,
  photo_url           text,
  is_published        boolean default false,
  created_at          timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.destinations    enable row level security;
alter table public.posts           enable row level security;
alter table public.leads           enable row level security;
alter table public.subscribers     enable row level security;
alter table public.email_campaigns enable row level security;
alter table public.promotions      enable row level security;
alter table public.testimonials    enable row level security;

-- Público pode ler destinos ativos
create policy "destinations_public_read" on public.destinations
  for select using (status != 'inactive');

-- Público pode ler posts publicados
create policy "posts_public_read" on public.posts
  for select using (status = 'published');

-- Público pode criar leads
create policy "leads_public_insert" on public.leads
  for insert with check (true);

-- Público pode criar subscribers
create policy "subscribers_public_insert" on public.subscribers
  for insert with check (true);

-- Público pode ler promoções ativas
create policy "promotions_public_read" on public.promotions
  for select using (is_active = true and (end_date is null or end_date > now()));

-- Público pode ler depoimentos publicados
create policy "testimonials_public_read" on public.testimonials
  for select using (is_published = true);

-- Admin autenticado tem acesso total
create policy "admin_full_destinations"    on public.destinations    for all using (auth.role() = 'authenticated');
create policy "admin_full_posts"           on public.posts           for all using (auth.role() = 'authenticated');
create policy "admin_full_leads"           on public.leads           for select using (auth.role() = 'authenticated');
create policy "admin_update_leads"         on public.leads           for update using (auth.role() = 'authenticated');
create policy "admin_full_subscribers"     on public.subscribers     for all using (auth.role() = 'authenticated');
create policy "admin_full_campaigns"       on public.email_campaigns for all using (auth.role() = 'authenticated');
create policy "admin_full_promotions"      on public.promotions      for all using (auth.role() = 'authenticated');
create policy "admin_full_testimonials"    on public.testimonials    for all using (auth.role() = 'authenticated');

-- ============================================================
-- UPDATED_AT trigger automático
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger destinations_updated_at    before update on public.destinations    for each row execute function public.handle_updated_at();
create trigger posts_updated_at           before update on public.posts           for each row execute function public.handle_updated_at();
create trigger email_campaigns_updated_at before update on public.email_campaigns for each row execute function public.handle_updated_at();

-- ============================================================
-- SEED — Destinos fictícios iniciais
-- ============================================================
insert into public.destinations (slug, name, short_description, long_description, category, cover_image_url, gallery_urls, base_price, duration_days, includes, highlights, whatsapp_message, status, sort_order)
values
(
  'porto-de-galinhas-pe',
  'Porto de Galinhas',
  'As piscinas naturais mais famosas do Brasil, a 60km do Recife.',
  'Porto de Galinhas é um dos destinos mais premiados do Brasil, famoso por suas piscinas naturais formadas por recifes de corais. Águas cristalinas em tons de verde e azul, passeios de jangada e uma orla cheia de vida. Ideal para famílias, casais e grupos que buscam natureza e conforto.',
  'nordeste',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80','https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80'],
  1890.00, 5,
  ARRAY['Hospedagem com café da manhã', 'Passeio de jangada nas piscinas naturais', 'Transfer aeroporto/hotel/aeroporto', 'Seguro viagem'],
  ARRAY['Piscinas naturais de corais', 'Mergulho com snorkel', 'Gastronomia fresca de frutos do mar', 'Vida noturna animada'],
  'Olá! Tenho interesse no pacote Porto de Galinhas. Poderia me passar mais informações?',
  'active', 1
),
(
  'maceio-alagoas',
  'Maceió',
  'Capital do verde em águas, Maceió tem as melhores piscinas naturais do Nordeste.',
  'Maceió encanta pela beleza singular de suas lagoas e piscinas naturais. A Praia de Ponta Verde, a Lagoa do Norte e os passeios de barco até Pajuçara são experiências únicas. A cidade combina litoral exuberante com cultura nordestina autêntica.',
  'nordeste',
  'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1548032885-b5e38734688a?w=800&q=80'],
  2190.00, 6,
  ARRAY['Hospedagem 4 estrelas na orla', 'City tour panorâmico', 'Passeio às piscinas naturais de Pajuçara', 'Seguro viagem', 'Transfer'],
  ARRAY['Piscinas naturais em alto mar', 'Lagoas de água doce', 'Gastronomia alagoana', 'Artesanato local'],
  'Olá! Quero saber mais sobre o pacote para Maceió!',
  'active', 2
),
(
  'fernando-de-noronha',
  'Fernando de Noronha',
  'O arquipélago mais exclusivo do Brasil. Mergulho, golfinhos e pôr do sol inesquecível.',
  'Fernando de Noronha é Patrimônio Natural da Humanidade pela UNESCO e o destino mais exclusivo do Brasil. Com apenas 3.000 visitantes permitidos por vez, oferece uma experiência única: praias intocadas, mergulho com tubarões e golfinhos, e o famoso pôr do sol do Forte dos Remédios.',
  'nordeste',
  'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1513836279014-a89f7d3d2523?w=800&q=80','https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80'],
  6890.00, 7,
  ARRAY['Passagem aérea Recife-Noronha-Recife', 'Pousada beira-mar', 'TAN (Taxa de Preservação Ambiental)', 'Passeio de barco com mergulho', 'Seguro viagem completo'],
  ARRAY['Praia do Sancho — eleita mais bonita do mundo', 'Mergulho com golfinhos', 'Baía dos Porcos', 'Pôr do sol no Forte dos Remédios'],
  'Olá! Tenho interesse no pacote para Fernando de Noronha. Quero saber mais!',
  'active', 3
),
(
  'natal-rio-grande-do-norte',
  'Natal e Litoral Norte RN',
  'Dunas, buggy e as maiores lagoas de água doce do Nordeste.',
  'Natal combina a energia de uma capital com praias de tirar o fôlego. O passeio de buggy pelas dunas do Genipabu, o mergulho em Maracajaú e as lagoas de Pitangui são imperdíveis. Uma viagem completa com atividades para todas as idades.',
  'nordeste',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'],
  1590.00, 5,
  ARRAY['Hospedagem 3 estrelas', 'Passeio de buggy nas dunas de Genipabu', 'Mergulho em Maracajaú', 'City tour Natal', 'Transfer'],
  ARRAY['Dunas do Genipabu', 'Lagoa de Pitangui', 'Praia de Pipa', 'Parrachos de Maracajaú'],
  'Olá! Quero mais informações sobre o pacote para Natal!',
  'active', 4
),
(
  'gramado-serra-gaucha',
  'Gramado e Serra Gaúcha',
  'Charme europeu no sul do Brasil. Fondue, chocolate e paisagens de tirar o fôlego.',
  'Gramado é a cidade mais romântica do Brasil. Com arquitetura inspirada na Europa, a cidade oferece experiências únicas: degustação em vinícolas, o Parque Snowland, o Lago Negro e a famosa Rua Coberta. Ideal para casais e famílias que buscam clima ameno e gastronomia sofisticada.',
  'nacional',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80'],
  2890.00, 5,
  ARRAY['Hospedagem pousada boutique', 'Passeio nas vinícolas de Bento Gonçalves', 'Degustação de fondue e chocolate', 'City tour Gramado e Canela', 'Seguro viagem'],
  ARRAY['Lago Negro', 'Parque Snowland', 'Vinícolas históricas', 'Mini Mundo e Aldeia do Papai Noel'],
  'Olá! Tenho interesse no pacote para Gramado! Pode me contar mais?',
  'active', 5
);

-- Depoimentos iniciais
insert into public.testimonials (client_name, destination_visited, rating, content, is_published)
values
('Ana Paula M.', 'Porto de Galinhas', 5, 'Experiência incrível! A equipe da Linha Reta cuidou de tudo com muita atenção. As piscinas naturais são ainda mais lindas do que nas fotos. Voltarei com certeza!', true),
('Carlos e Mariana S.', 'Fernando de Noronha', 5, 'Nossa lua de mel foi perfeita. Tudo organizado nos mínimos detalhes. Noronha é um paraíso e a Linha Reta tornou a viagem ainda mais especial.', true),
('Roberto A.', 'Gramado', 5, 'Viajamos com a família e foi tudo impecável. Hotel excelente, passeios bem organizados e atendimento sempre disponível no WhatsApp. Super recomendo!', true);
