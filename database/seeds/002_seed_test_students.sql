
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
  ('Rina Andriamampianina',   'rina@hei.mg',   '$2b$10$ZCbhiT/UWrR0hQ1QBnze1OdyBXqyujSLToktvEUD2CiTw8w/4a152', 'student', TRUE),
  ('Tojo Rakotomalala',       'tojo@hei.mg',   '$2b$10$bTTXoABZOZwFCSgvosfIeegzsvLlaHUaorhqSizOlSmqX2Ms.Ympe', 'student', TRUE),
  ('Fara Ravelojaona',        'fara@hei.mg',   '$2b$10$pRIPTnAuh9OriKmpr4NRJuHKAyMHiqeSKiIKJ1UYloP4rfcE0If3u', 'student', FALSE), 
  ('Hary Randrianasolo',      'hary@hei.mg',   '$2b$10$10muif.nDFCH1oq9C0GXQeSOilxAdYLVVK.QE4AMuywq6FShm2Nde', 'student', TRUE),
  ('Nomena Ravaka',           'nomena@hei.mg', '$2b$10$2pM8MYJ432nru0Y09C75sedk1ICJTgQ/hJaaa0AX9Vncn6Qdef.Qi', 'student', TRUE)
ON CONFLICT (email) DO NOTHING;
