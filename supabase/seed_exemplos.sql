-- =============================================================
--  LOJAS DE EXEMPLO (OPCIONAL) — só pra ver a área de membros cheia
-- =============================================================
--  São lojas FICTÍCIAS, marcadas com [EXEMPLO]. Rode no SQL Editor
--  se quiser testar. ANTES DE LANÇAR, apague com:
--
--    delete from public.lojas where nome like '[EXEMPLO]%';
-- =============================================================

insert into public.lojas (nome, faixa, descricao, site_url, instagram, whatsapp, endereco, tags) values
  ('[EXEMPLO] Ateliê Lua', 100,
   'Vestidos leves com ótimo caimento e preço difícil de achar. Troca fácil.',
   'https://exemplo.com', '@exemplo', null, null, array['feminino', 'vestidos']),
  ('[EXEMPLO] Costa & Co.', 200,
   'Streetwear com tecido grosso e estampa que não desbota na lavagem.',
   'https://exemplo.com', '@exemplo', '11999999999', null, array['masculino', 'streetwear']),
  ('[EXEMPLO] Nova Trama', 200,
   'Básicos de algodão que duram. Boa grade de tamanhos, inclusive plus size.',
   'https://exemplo.com', null, '11999999999', null, array['feminino', 'plus size', 'básicos']),
  ('[EXEMPLO] Brás Jeans Fábrica', 300,
   'Jeans direto da fábrica no Brás. Vende no atacado e no varejo.',
   null, '@exemplo', '11999999999', 'Rua Exemplo, 100 — Brás, São Paulo - SP', array['jeans', 'atacado', 'unissex']),
  ('[EXEMPLO] Maré Moda Praia', 500,
   'Biquínis e saídas de praia com acabamento de marca grande pela metade do preço.',
   'https://exemplo.com', '@exemplo', null, null, array['feminino', 'praia']),
  ('[EXEMPLO] Alfaiataria Norte', 1000,
   'Peças de alfaiataria sob medida, prontas em até 10 dias.',
   'https://exemplo.com', '@exemplo', '11999999999', null, array['masculino', 'alfaiataria']);
