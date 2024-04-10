CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  subscriptions INTEGER ARRAY DEFAULT ARRAY[]::INTEGER[],
  followers INTEGER ARRAY DEFAULT ARRAY[]::INTEGER[],
  createdSubscription VARCHAR(255) ARRAY DEFAULT ARRAY[]::VARCHAR[],
  isActivated BOOLEAN;
  ActivationLink VARCHAR(255);
  resetPasswordToken VARCHAR(255);
);

CREATE TABLE subs (
  id SERIAL PRIMARY KEY,
  subname VARCHAR(255) NOT NULL,
  sub_about VARCHAR(255),
  creator_id INTEGER REFERENCES users(id),
  buyers INTEGER ARRAY DEFAULT ARRAY[]::INTEGER[],
  price DECIMAL NOT NULL,
  sub_avatar VARCHAR(255),
  sub_background VARCHAR(255),
  content18plus BOOLEAN,
);

CREATE TABLE additionalsub (
  id SERIAL PRIMARY KEY,
  add_sub_name VARCHAR(255) NOT NULL,
  add_sub_about VARCHAR(255),
  add_sub_price DECIMAL,
  add_sub_relatedsub INTEGER REFERENCES subs(id),
  add_sub_buyers INTEGER ARRAY DEFAULT ARRAY[]::INTEGER[],
)

CREATE TABLE createdposts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subs_id INTEGER ARRAY REFERENCES subs(id),
  add_sub_id INTEGER ARRAY REFERENCES additionalsub(id),
  content TEXT NOT NULL
);