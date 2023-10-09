-- Table: public.Pincode_charging

DROP TABLE IF EXISTS public.pincode_buycard;

CREATE TABLE IF NOT EXISTS public.pincode_buycard
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    transaction_status character varying(10) NOT NULL,
    partner_ref_id character varying(180) NOT NULL,
    product_code character varying(50) NOT NULL,
    quantity integer DEFAULT 0,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT pincode_buycard_pkey PRIMARY KEY (id)
)

-- Table: public.buycard_histories
DROP TABLE IF EXISTS public.buycard_histories;

CREATE TABLE IF NOT EXISTS public.buycard_histories
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    transaction_status character varying(10) NOT NULL,
    partner_ref_id character varying(180) NOT NULL,
    product_code character varying(50) NOT NULL,
    quantity integer DEFAULT 0,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT buycard_histories_pkey PRIMARY KEY (id)
)

-- Table: public.buycard_transaction

DROP TABLE IF EXISTS public.pincode_transaction;

CREATE TABLE IF NOT EXISTS public.buycard_transaction
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    transaction_status character varying(10) NOT NULL,
    partner_ref_id character varying(180) NOT NULL,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT Pincode_transaction_pkey PRIMARY KEY (id)
)

