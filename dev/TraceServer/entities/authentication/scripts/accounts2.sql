--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: reset_all(); Type: PROCEDURE; Schema: public; Owner: webadmin
--

CREATE PROCEDURE public.reset_all()
    LANGUAGE sql
    AS $$TRUNCATE "TranD" RESTART IDENTITY CASCADE;
TRUNCATE "TranH" RESTART IDENTITY CASCADE;
TRUNCATE "AccOpBal" RESTART IDENTITY CASCADE;
TRUNCATE "ExtGstTranD" RESTART IDENTITY CASCADE;
delete from "AccM" CASCADE where id > 30;$$;


ALTER PROCEDURE public.reset_all() OWNER TO webadmin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AccClassM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."AccClassM" (
    id smallint NOT NULL,
    "accClass" text NOT NULL
);


ALTER TABLE public."AccClassM" OWNER TO webadmin;

--
-- Name: AccM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."AccM" (
    id integer NOT NULL,
    "accCode" text NOT NULL,
    "accName" text NOT NULL,
    "accType" character(1) NOT NULL,
    "parentId" integer,
    "accLeaf" character(1) DEFAULT 'n'::bpchar NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "classId" smallint NOT NULL
);


ALTER TABLE public."AccM" OWNER TO webadmin;

--
-- Name: AccM_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."AccM_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AccM_id_seq" OWNER TO webadmin;

--
-- Name: AccM_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."AccM_id_seq" OWNED BY public."AccM".id;


--
-- Name: AccOpBal; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."AccOpBal" (
    id integer NOT NULL,
    "accId" integer NOT NULL,
    "finYearId" smallint NOT NULL,
    amount numeric(12,2) NOT NULL,
    dc character(1) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "branchId" integer NOT NULL
);


ALTER TABLE public."AccOpBal" OWNER TO webadmin;

--
-- Name: AccOpBal_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."AccOpBal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AccOpBal_id_seq" OWNER TO webadmin;

--
-- Name: AccOpBal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."AccOpBal_id_seq" OWNED BY public."AccOpBal".id;


--
-- Name: BankOpBal; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."BankOpBal" (
    id integer NOT NULL,
    "accId" integer NOT NULL,
    amount numeric(14,2) DEFAULT 0 NOT NULL,
    dc character(1) NOT NULL,
    "finYearId" smallint NOT NULL
);


ALTER TABLE public."BankOpBal" OWNER TO webadmin;

--
-- Name: BranchM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."BranchM" (
    id smallint NOT NULL,
    "branchName" text NOT NULL,
    remarks text,
    "jData" jsonb,
    "branchCode" text NOT NULL
);


ALTER TABLE public."BranchM" OWNER TO webadmin;

--
-- Name: BranchM_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."BranchM_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."BranchM_id_seq" OWNER TO webadmin;

--
-- Name: BranchM_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."BranchM_id_seq" OWNED BY public."BranchM".id;


--
-- Name: BrandM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."BrandM" (
    id integer NOT NULL,
    "brandName" text NOT NULL,
    remarks text,
    "jData" jsonb
);


ALTER TABLE public."BrandM" OWNER TO webadmin;

--
-- Name: BrandM_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."BrandM_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."BrandM_id_seq" OWNER TO webadmin;

--
-- Name: BrandM_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."BrandM_id_seq" OWNED BY public."BrandM".id;


--
-- Name: CategoryM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."CategoryM" (
    id integer NOT NULL,
    "catName" text NOT NULL,
    "parentId" integer
);


ALTER TABLE public."CategoryM" OWNER TO webadmin;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO webadmin;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."CategoryM".id;


--
-- Name: ExtBankOpBalAccM_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."ExtBankOpBalAccM_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ExtBankOpBalAccM_id_seq" OWNER TO webadmin;

--
-- Name: ExtBankOpBalAccM_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."ExtBankOpBalAccM_id_seq" OWNED BY public."BankOpBal".id;


--
-- Name: ExtBankReconTranD; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."ExtBankReconTranD" (
    id integer NOT NULL,
    "clearDate" date,
    "clearRemarks" text,
    "tranDetailsId" integer NOT NULL
);


ALTER TABLE public."ExtBankReconTranD" OWNER TO webadmin;

--
-- Name: ExtBankReconTranD_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."ExtBankReconTranD_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ExtBankReconTranD_id_seq" OWNER TO webadmin;

--
-- Name: ExtBankReconTranD_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."ExtBankReconTranD_id_seq" OWNED BY public."ExtBankReconTranD".id;


--
-- Name: ExtGstTranD; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."ExtGstTranD" (
    id integer NOT NULL,
    gstin text,
    rate numeric(5,2) NOT NULL,
    cgst numeric(12,2) NOT NULL,
    sgst numeric(12,2) NOT NULL,
    igst numeric(12,2) NOT NULL,
    "isInput" boolean DEFAULT true NOT NULL,
    "tranDetailsId" integer NOT NULL,
    hsn text
);


ALTER TABLE public."ExtGstTranD" OWNER TO webadmin;

--
-- Name: ExtGstTranD_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."ExtGstTranD_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ExtGstTranD_id_seq" OWNER TO webadmin;

--
-- Name: ExtGstTranD_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."ExtGstTranD_id_seq" OWNED BY public."ExtGstTranD".id;


--
-- Name: ExtMetaTranD; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."ExtMetaTranD" (
    id integer NOT NULL,
    "instrNo" text NOT NULL,
    "tranDetailsId" integer NOT NULL
);


ALTER TABLE public."ExtMetaTranD" OWNER TO webadmin;

--
-- Name: ExtMetaTranD_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."ExtMetaTranD_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ExtMetaTranD_id_seq" OWNER TO webadmin;

--
-- Name: ExtMetaTranD_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."ExtMetaTranD_id_seq" OWNED BY public."ExtMetaTranD".id;


--
-- Name: FinYearM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."FinYearM" (
    "startDate" date NOT NULL,
    "endDate" date,
    id smallint NOT NULL
);


ALTER TABLE public."FinYearM" OWNER TO webadmin;

--
-- Name: GodownM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."GodownM" (
    id smallint NOT NULL,
    "godCode" text NOT NULL,
    remarks text,
    "jData" jsonb
);


ALTER TABLE public."GodownM" OWNER TO webadmin;

--
-- Name: GodownM_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."GodownM_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."GodownM_id_seq" OWNER TO webadmin;

--
-- Name: GodownM_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."GodownM_id_seq" OWNED BY public."GodownM".id;


--
-- Name: InvExtD; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."InvExtD" (
    id integer NOT NULL,
    "prId" integer NOT NULL,
    price numeric(12,2) DEFAULT 0 NOT NULL,
    qty smallint DEFAULT 0 NOT NULL,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    discount numeric(12,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public."InvExtD" OWNER TO webadmin;

--
-- Name: InvD_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."InvD_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."InvD_id_seq" OWNER TO webadmin;

--
-- Name: InvD_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."InvD_id_seq" OWNED BY public."InvExtD".id;


--
-- Name: TranCounter; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."TranCounter" (
    id integer NOT NULL,
    "finYearId" smallint NOT NULL,
    "branchId" smallint NOT NULL,
    "tranTypeId" smallint NOT NULL,
    "lastNo" integer NOT NULL
);


ALTER TABLE public."TranCounter" OWNER TO webadmin;

--
-- Name: LastTranNumber_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."LastTranNumber_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."LastTranNumber_id_seq" OWNER TO webadmin;

--
-- Name: LastTranNumber_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."LastTranNumber_id_seq" OWNED BY public."TranCounter".id;


--
-- Name: Notes; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."Notes" (
    id integer NOT NULL,
    remarks text NOT NULL,
    "jData" jsonb,
    "notesDate" date NOT NULL,
    "branchId" smallint NOT NULL
);


ALTER TABLE public."Notes" OWNER TO webadmin;

--
-- Name: PosM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."PosM" (
    id smallint NOT NULL,
    "posName" text NOT NULL,
    prefix text,
    "jData" jsonb,
    "branchId" smallint
);


ALTER TABLE public."PosM" OWNER TO webadmin;

--
-- Name: PosM_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."PosM_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PosM_id_seq" OWNER TO webadmin;

--
-- Name: PosM_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."PosM_id_seq" OWNED BY public."PosM".id;


--
-- Name: ProductM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."ProductM" (
    id integer NOT NULL,
    "catId" integer NOT NULL,
    hsn numeric(8,0),
    "brandId" integer NOT NULL,
    info text,
    "unitId" smallint,
    label text NOT NULL,
    "jData" jsonb
);


ALTER TABLE public."ProductM" OWNER TO webadmin;

--
-- Name: ProductM_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."ProductM_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ProductM_id_seq" OWNER TO webadmin;

--
-- Name: ProductM_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."ProductM_id_seq" OWNED BY public."ProductM".id;


--
-- Name: Settings; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."Settings" (
    id smallint NOT NULL,
    key text NOT NULL,
    "textValue" text,
    "jData" jsonb,
    "intValue" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Settings" OWNER TO webadmin;

--
-- Name: TranD; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."TranD" (
    id integer NOT NULL,
    "accId" integer NOT NULL,
    remarks text,
    dc character(1) NOT NULL,
    amount numeric(12,2) NOT NULL,
    "tranHeaderId" integer NOT NULL,
    "lineRefNo" text,
    "instrNo" text
);


ALTER TABLE public."TranD" OWNER TO webadmin;

--
-- Name: TranD_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."TranD_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."TranD_id_seq" OWNER TO webadmin;

--
-- Name: TranD_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."TranD_id_seq" OWNED BY public."TranD".id;


--
-- Name: TranH; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."TranH" (
    id integer NOT NULL,
    "tranDate" date NOT NULL,
    "userRefNo" text,
    remarks text,
    tags text,
    "jData" jsonb,
    "tranTypeId" smallint NOT NULL,
    "finYearId" smallint NOT NULL,
    "branchId" smallint NOT NULL,
    "posId" smallint,
    "autoRefNo" text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TranH" OWNER TO webadmin;

--
-- Name: TranH_id_seq; Type: SEQUENCE; Schema: public; Owner: webadmin
--

CREATE SEQUENCE public."TranH_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."TranH_id_seq" OWNER TO webadmin;

--
-- Name: TranH_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webadmin
--

ALTER SEQUENCE public."TranH_id_seq" OWNED BY public."TranH".id;


--
-- Name: TranTypeM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."TranTypeM" (
    id smallint NOT NULL,
    "tranType" text NOT NULL,
    "tranCode" character(3) NOT NULL
);


ALTER TABLE public."TranTypeM" OWNER TO webadmin;

--
-- Name: UnitM; Type: TABLE; Schema: public; Owner: webadmin
--

CREATE TABLE public."UnitM" (
    id smallint NOT NULL,
    "unitName" text NOT NULL,
    "jData" jsonb,
    symbol text NOT NULL
);


ALTER TABLE public."UnitM" OWNER TO webadmin;

--
-- Name: AccM id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccM" ALTER COLUMN id SET DEFAULT nextval('public."AccM_id_seq"'::regclass);


--
-- Name: AccOpBal id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccOpBal" ALTER COLUMN id SET DEFAULT nextval('public."AccOpBal_id_seq"'::regclass);


--
-- Name: BankOpBal id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BankOpBal" ALTER COLUMN id SET DEFAULT nextval('public."ExtBankOpBalAccM_id_seq"'::regclass);


--
-- Name: BranchM id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BranchM" ALTER COLUMN id SET DEFAULT nextval('public."BranchM_id_seq"'::regclass);


--
-- Name: BrandM id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BrandM" ALTER COLUMN id SET DEFAULT nextval('public."BrandM_id_seq"'::regclass);


--
-- Name: CategoryM id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."CategoryM" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: ExtBankReconTranD id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ExtBankReconTranD" ALTER COLUMN id SET DEFAULT nextval('public."ExtBankReconTranD_id_seq"'::regclass);


--
-- Name: ExtGstTranD id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ExtGstTranD" ALTER COLUMN id SET DEFAULT nextval('public."ExtGstTranD_id_seq"'::regclass);


--
-- Name: ExtMetaTranD id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ExtMetaTranD" ALTER COLUMN id SET DEFAULT nextval('public."ExtMetaTranD_id_seq"'::regclass);


--
-- Name: GodownM id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."GodownM" ALTER COLUMN id SET DEFAULT nextval('public."GodownM_id_seq"'::regclass);


--
-- Name: InvExtD id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."InvExtD" ALTER COLUMN id SET DEFAULT nextval('public."InvD_id_seq"'::regclass);


--
-- Name: PosM id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."PosM" ALTER COLUMN id SET DEFAULT nextval('public."PosM_id_seq"'::regclass);


--
-- Name: ProductM id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ProductM" ALTER COLUMN id SET DEFAULT nextval('public."ProductM_id_seq"'::regclass);


--
-- Name: TranCounter id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranCounter" ALTER COLUMN id SET DEFAULT nextval('public."LastTranNumber_id_seq"'::regclass);


--
-- Name: TranD id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranD" ALTER COLUMN id SET DEFAULT nextval('public."TranD_id_seq"'::regclass);


--
-- Name: TranH id; Type: DEFAULT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranH" ALTER COLUMN id SET DEFAULT nextval('public."TranH_id_seq"'::regclass);


--
-- Data for Name: AccClassM; Type: TABLE DATA; Schema: public; Owner: webadmin
--

INSERT INTO public."AccClassM" VALUES (1, 'branch');
INSERT INTO public."AccClassM" VALUES (2, 'capital');
INSERT INTO public."AccClassM" VALUES (3, 'other');
INSERT INTO public."AccClassM" VALUES (4, 'loan');
INSERT INTO public."AccClassM" VALUES (5, 'iexp');
INSERT INTO public."AccClassM" VALUES (6, 'purchase');
INSERT INTO public."AccClassM" VALUES (7, 'dexp');
INSERT INTO public."AccClassM" VALUES (8, 'dincome');
INSERT INTO public."AccClassM" VALUES (9, 'iincome');
INSERT INTO public."AccClassM" VALUES (10, 'sale');
INSERT INTO public."AccClassM" VALUES (11, 'creditor');
INSERT INTO public."AccClassM" VALUES (12, 'debtor');
INSERT INTO public."AccClassM" VALUES (13, 'bank');
INSERT INTO public."AccClassM" VALUES (14, 'cash');
INSERT INTO public."AccClassM" VALUES (15, 'card');
INSERT INTO public."AccClassM" VALUES (16, 'ecash');


--
-- Data for Name: AccM; Type: TABLE DATA; Schema: public; Owner: webadmin
--

INSERT INTO public."AccM" VALUES (1, 'BranchDivision', 'Branch / Divisions', 'L', NULL, 'N', true, 1);
INSERT INTO public."AccM" VALUES (2, 'Capitalaccount', 'Capital Account', 'L', NULL, 'N', true, 2);
INSERT INTO public."AccM" VALUES (6, 'CurrentLiabilities', 'Current Liabilities', 'L', NULL, 'N', true, 3);
INSERT INTO public."AccM" VALUES (10, 'LoansLiability', 'Loans Liability', 'L', NULL, 'N', true, 4);
INSERT INTO public."AccM" VALUES (14, 'Suspense', 'Suspense A/c', 'L', NULL, 'N', true, 3);
INSERT INTO public."AccM" VALUES (15, 'CurrentAssets', 'Current Assets', 'A', NULL, 'N', true, 3);
INSERT INTO public."AccM" VALUES (23, 'MiscExpences', 'Misc Expences (Asset)', 'A', NULL, 'N', true, 3);
INSERT INTO public."AccM" VALUES (24, 'Investments', 'Investments', 'A', NULL, 'N', true, 3);
INSERT INTO public."AccM" VALUES (25, 'IndirectExpences', 'Indirect Expences', 'E', NULL, 'N', true, 5);
INSERT INTO public."AccM" VALUES (26, 'Purchase', 'Purchase Accounts', 'E', NULL, 'N', true, 6);
INSERT INTO public."AccM" VALUES (27, 'DirectExpences', 'Direct Expences', 'E', NULL, 'N', true, 7);
INSERT INTO public."AccM" VALUES (28, 'DirectIncome', 'Direct Incomes', 'I', NULL, 'N', true, 8);
INSERT INTO public."AccM" VALUES (29, 'Indirectincome', 'Indirect Incomes', 'I', NULL, 'N', true, 9);
INSERT INTO public."AccM" VALUES (30, 'Sales', 'Sales Account', 'I', NULL, 'N', true, 10);
INSERT INTO public."AccM" VALUES (4, 'Capital', 'Capital', 'L', 3, 'Y', true, 2);
INSERT INTO public."AccM" VALUES (5, 'ReservesAndSurplus', 'Reserves & Surplus', 'L', 2, 'N', true, 2);
INSERT INTO public."AccM" VALUES (7, 'DutiesAndTaxes', 'Duties & Taxes', 'L', 6, 'N', true, 3);
INSERT INTO public."AccM" VALUES (8, 'Provisions', 'Provisions', 'L', 6, 'N', true, 3);
INSERT INTO public."AccM" VALUES (9, 'SundryCreditors', 'Sundry Creditors', 'L', 6, 'N', true, 11);
INSERT INTO public."AccM" VALUES (11, 'BankOd', 'Bank OD Account', 'L', 10, 'N', true, 13);
INSERT INTO public."AccM" VALUES (12, 'SecuredLoans', 'Secured Loans', 'L', 10, 'N', true, 4);
INSERT INTO public."AccM" VALUES (13, 'UnsecuredLoans', 'Unsecured Loans', 'L', 10, 'N', true, 4);
INSERT INTO public."AccM" VALUES (16, 'BankAccounts', 'Bank Accounts', 'A', 15, 'N', true, 13);
INSERT INTO public."AccM" VALUES (17, 'CashInHand', 'Cash-in-Hand', 'A', 15, 'N', true, 14);
INSERT INTO public."AccM" VALUES (18, 'BankOCC', 'Bank Cash Credit', 'L', 10, 'N', true, 13);
INSERT INTO public."AccM" VALUES (19, 'DepositsAsset', 'Deposits (Asset)', 'A', 15, 'N', true, 3);
INSERT INTO public."AccM" VALUES (20, 'StockInHand', 'Stock in Hand', 'A', 15, 'N', true, 3);
INSERT INTO public."AccM" VALUES (21, 'LoansAndAdvances', 'Loans & Advances (Asset)', 'A', 15, 'N', true, 3);
INSERT INTO public."AccM" VALUES (22, 'SundryDebtors', 'Sundry Debtors', 'A', 15, 'N', true, 12);
INSERT INTO public."AccM" VALUES (3, 'CapitalSubgroup', 'Capital Account Subgroup', 'L', 2, 'N', true, 2);


--
-- Data for Name: AccOpBal; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: BankOpBal; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: BranchM; Type: TABLE DATA; Schema: public; Owner: webadmin
--

INSERT INTO public."BranchM" VALUES (1, 'head office', NULL, NULL, 'head');


--
-- Data for Name: BrandM; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: CategoryM; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: ExtBankReconTranD; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: ExtGstTranD; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: ExtMetaTranD; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: FinYearM; Type: TABLE DATA; Schema: public; Owner: webadmin
--

INSERT INTO public."FinYearM" VALUES ('2003-04-01', '2004-03-31', 2003);
INSERT INTO public."FinYearM" VALUES ('2004-04-01', '2005-03-31', 2004);
INSERT INTO public."FinYearM" VALUES ('2005-04-01', '2006-03-31', 2005);
INSERT INTO public."FinYearM" VALUES ('2006-04-01', '2007-03-31', 2006);
INSERT INTO public."FinYearM" VALUES ('2007-04-01', '2008-03-31', 2007);
INSERT INTO public."FinYearM" VALUES ('2008-04-01', '2009-03-31', 2008);
INSERT INTO public."FinYearM" VALUES ('2009-04-01', '2010-03-31', 2009);
INSERT INTO public."FinYearM" VALUES ('2010-04-01', '2011-03-31', 2010);
INSERT INTO public."FinYearM" VALUES ('2011-04-01', '2012-03-31', 2011);
INSERT INTO public."FinYearM" VALUES ('2012-04-01', '2013-03-31', 2012);
INSERT INTO public."FinYearM" VALUES ('2013-04-01', '2014-03-31', 2013);
INSERT INTO public."FinYearM" VALUES ('2014-04-01', '2015-03-31', 2014);
INSERT INTO public."FinYearM" VALUES ('2015-04-01', '2016-03-31', 2015);
INSERT INTO public."FinYearM" VALUES ('2016-04-01', '2017-03-31', 2016);
INSERT INTO public."FinYearM" VALUES ('2017-04-01', '2018-03-31', 2017);
INSERT INTO public."FinYearM" VALUES ('2018-04-01', '2019-03-31', 2018);
INSERT INTO public."FinYearM" VALUES ('2019-04-01', '2020-03-31', 2019);
INSERT INTO public."FinYearM" VALUES ('2020-04-01', '2021-03-31', 2020);
INSERT INTO public."FinYearM" VALUES ('2021-04-01', '2022-03-31', 2021);
INSERT INTO public."FinYearM" VALUES ('2002-04-01', '2003-03-31', 2002);
INSERT INTO public."FinYearM" VALUES ('2022-04-02', '2023-03-30', 2022);
INSERT INTO public."FinYearM" VALUES ('2023-04-01', '2024-03-30', 2023);
INSERT INTO public."FinYearM" VALUES ('2024-04-01', '2025-03-31', 2024);


--
-- Data for Name: GodownM; Type: TABLE DATA; Schema: public; Owner: webadmin
--

INSERT INTO public."GodownM" VALUES (1, 'main', NULL, NULL);


--
-- Data for Name: InvExtD; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: Notes; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: PosM; Type: TABLE DATA; Schema: public; Owner: webadmin
--

INSERT INTO public."PosM" VALUES (1, 'sample1', NULL, NULL, 1);


--
-- Data for Name: ProductM; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: webadmin
--

INSERT INTO public."Settings" VALUES (1, 'menu', NULL, '{"menu": [{"name": "financialAccounting", "label": "Accounts", "children": [{"name": "finalAccounts", "label": "Final Accounts", "children": [{"name": "trialBalance", "label": "Trial Balance", "component": "TraceTrialBalance"}, {"name": "balanceSheet", "label": "Balance Sheet", "component": "balanceSheet"}, {"name": "pl", "label": "PL Account", "component": "plAccount"}]}, {"name": "sales", "label": "Sales", "children": [{"name": "creditSales", "label": "Credit Sales"}, {"name": "cashSales", "label": "Cash Sales"}, {"name": "mixedSales", "label": "Mixed Sales"}, {"name": "cardSales", "label": "Card Sales"}]}, {"name": "purchase", "label": "Purchase", "children": [{"name": "creditPurchase", "label": "Credit Purchase"}, {"name": "cashPurchase", "label": "Cash Purchase"}]}, {"name": "misc", "label": "Misc", "children": [{"name": "contra", "label": "Contra"}, {"name": "journal", "label": "Journals"}, {"name": "stockJournal", "label": "Stock Journal"}]}, {"name": "payments", "label": "Payments", "children": [{"name": "cashPayment", "label": "Cash Payment"}, {"name": "chequePayment", "label": "Cheque Payment"}]}, {"name": "receipts", "label": "Receipts", "children": [{"name": "cashReceipt", "label": "Cash Receipt"}, {"name": "cashReceipt", "label": "Cash receipt"}]}]}, {"name": "payroll", "label": "Payroll", "children": [{"name": "transactions", "label": "Transactions", "children": [{"name": "timeSheet", "label": "Time Sheet", "children": []}, {"name": "leaves", "label": "Leaves", "children": []}]}, {"name": "processing", "label": "Processing", "children": [{"name": "processPayroll", "label": "Process Payroll", "children": []}, {"name": "undoProcessing", "label": "Undo Processing", "children": []}]}, {"name": "stationary", "label": "Stationary", "children": [{"name": "payslips", "label": "Payslips", "children": []}, {"name": "loanAccount", "label": "Loan Account", "children": []}]}, {"name": "reports", "label": "Reports", "children": [{"name": "providentFund", "label": "ProvidentFund", "children": []}, {"name": "esi", "label": "ESI", "children": []}]}]}, {"name": "marketing", "label": "Marketing", "children": [{"name": "mission", "label": "Mission", "children": [{"name": "missionStatement", "label": "Mission Statement", "children": []}, {"name": "objectives", "label": "Objectives", "children": []}]}, {"name": "analysis", "label": "Analysis", "children": [{"name": "opportunities", "label": "Opportunities", "children": []}, {"name": "5canalysis", "label": "5C Analysis", "children": []}, {"name": "swotAnalysis", "label": "SWOT Analysis", "children": []}, {"name": "pestAnalysis", "label": "PEST Analysis", "children": []}]}, {"name": "strategy", "label": "Strategy", "children": [{"name": "targetAudience", "label": "Target Audience", "children": []}, {"name": "measurableGoals", "label": "Measurable Goals", "children": []}, {"name": "budget", "label": "Budget", "children": []}]}, {"name": "marketingMix", "label": "Marketing Mix", "children": [{"name": "productDevelopment", "label": "Product Dev", "children": []}, {"name": "pricing", "label": "Pricing", "children": []}, {"name": "promotion", "label": "Promotion", "children": []}, {"name": "placeAndDistribution", "label": "Place and Distribution", "children": []}]}, {"name": "implementation", "label": "Implementation", "children": [{"name": "planToAction", "label": "Plan to Action", "children": []}, {"name": "monitorResults", "label": "Monitor Results", "children": []}]}]}, {"name": "recruitment", "label": "Recruitment", "children": [{"name": "planning", "label": "Planning", "children": [{"name": "vacancy", "label": "Vacancy", "children": []}, {"name": "resumesScreening", "label": "Resume Screening", "children": []}, {"name": "jobAnalysis", "label": "Job Analysis", "children": []}, {"name": "jobDescription", "label": "Job Description", "children": []}, {"name": "jobSpecification", "label": "Job Specification", "children": []}, {"name": "jobEvaluation", "label": "Job Evaluation", "children": []}]}, {"name": "execution", "label": "Execution", "children": [{"name": "directRecruitment", "label": "Direct Recruitment", "children": []}, {"name": "employmentExchange", "label": "Employment Exch.", "children": []}, {"name": "employmentAgencies", "label": "Employment Ag.", "children": []}, {"name": "advertisement", "label": "Advertisement", "children": []}, {"name": "professionalAssociation", "label": "Proff Associations", "children": []}, {"name": "campusRecruitment", "label": "Campus Recruit", "children": []}, {"name": "wordOfMouth", "label": "Word Of Mouth", "children": []}]}, {"name": "screening", "label": "Screening", "children": [{"name": "processing", "label": "Processing", "children": []}, {"name": "finalization", "label": "Finalization", "children": []}]}, {"name": "stationary", "label": "Stationary", "children": [{"name": "coverLetter", "label": "Cover Letter", "children": []}, {"name": "appointmentLetter", "label": "Appointment Letter", "children": []}]}]}, {"name": "sampleForms", "label": "Sample Forms", "children": [{"name": "registrations", "label": "Registrations", "children": [{"name": "gym", "label": "Gym", "children": []}, {"name": "studentAdmission", "label": "Student Admission", "children": []}, {"name": "clubMembership", "label": "Club Membership", "children": []}, {"name": "employeeInfo", "label": "Employee Information", "children": []}]}, {"name": "applications", "label": "Applications", "children": [{"name": "loanApplication", "label": "Loan Application", "children": []}, {"name": "electronicsRental", "label": "Electronics Rental", "children": []}]}, {"name": "feedbacks", "label": "Feedbacks", "children": [{"name": "employeePerformance", "label": "Employee Performance", "children": []}, {"name": "softwareEvaluation", "label": "Software Evaluation", "children": []}, {"name": "eventFeedback", "label": "Event Feedback", "children": []}]}, {"name": "others", "label": "Others", "children": [{"name": "deeplyNested", "label": "Deeply Nested", "children": []}]}]}]}', 0);


--
-- Data for Name: TranCounter; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: TranD; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: TranH; Type: TABLE DATA; Schema: public; Owner: webadmin
--



--
-- Data for Name: TranTypeM; Type: TABLE DATA; Schema: public; Owner: webadmin
--

INSERT INTO public."TranTypeM" VALUES (1, 'Journal', 'JOU');
INSERT INTO public."TranTypeM" VALUES (2, 'Payment', 'PAY');
INSERT INTO public."TranTypeM" VALUES (3, 'Receipt', 'REC');
INSERT INTO public."TranTypeM" VALUES (4, 'Sales', 'SAL');
INSERT INTO public."TranTypeM" VALUES (5, 'Purchase', 'PUR');
INSERT INTO public."TranTypeM" VALUES (6, 'Contra', 'CON');


--
-- Data for Name: UnitM; Type: TABLE DATA; Schema: public; Owner: webadmin
--

INSERT INTO public."UnitM" VALUES (1, 'piece', NULL, 'pc');


--
-- Name: AccM_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."AccM_id_seq"', 116, true);


--
-- Name: AccOpBal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."AccOpBal_id_seq"', 1, false);


--
-- Name: BranchM_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."BranchM_id_seq"', 4, true);


--
-- Name: BrandM_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."BrandM_id_seq"', 1, false);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."Category_id_seq"', 1, false);


--
-- Name: ExtBankOpBalAccM_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."ExtBankOpBalAccM_id_seq"', 1, false);


--
-- Name: ExtBankReconTranD_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."ExtBankReconTranD_id_seq"', 1, false);


--
-- Name: ExtGstTranD_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."ExtGstTranD_id_seq"', 1, false);


--
-- Name: ExtMetaTranD_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."ExtMetaTranD_id_seq"', 1, false);


--
-- Name: GodownM_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."GodownM_id_seq"', 1, false);


--
-- Name: InvD_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."InvD_id_seq"', 1, false);


--
-- Name: LastTranNumber_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."LastTranNumber_id_seq"', 1, true);


--
-- Name: PosM_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."PosM_id_seq"', 1, true);


--
-- Name: ProductM_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."ProductM_id_seq"', 1, false);


--
-- Name: TranD_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."TranD_id_seq"', 1, false);


--
-- Name: TranH_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webadmin
--

SELECT pg_catalog.setval('public."TranH_id_seq"', 1, false);


--
-- Name: AccClassM AccClassM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccClassM"
    ADD CONSTRAINT "AccClassM_pkey" PRIMARY KEY (id);


--
-- Name: AccM AccM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccM"
    ADD CONSTRAINT "AccM_pkey" PRIMARY KEY (id);


--
-- Name: AccOpBal AccOpBal_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccOpBal"
    ADD CONSTRAINT "AccOpBal_pkey" PRIMARY KEY (id);


--
-- Name: BankOpBal BankOpBal_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BankOpBal"
    ADD CONSTRAINT "BankOpBal_pkey" PRIMARY KEY (id);


--
-- Name: BranchM BranchM_branchCode_key; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BranchM"
    ADD CONSTRAINT "BranchM_branchCode_key" UNIQUE ("branchCode");


--
-- Name: BranchM BranchM_branchName_key; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BranchM"
    ADD CONSTRAINT "BranchM_branchName_key" UNIQUE ("branchName");


--
-- Name: BranchM BranchM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BranchM"
    ADD CONSTRAINT "BranchM_pkey" PRIMARY KEY (id);


--
-- Name: BrandM BrandM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BrandM"
    ADD CONSTRAINT "BrandM_pkey" PRIMARY KEY (id);


--
-- Name: CategoryM Category_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."CategoryM"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ExtBankReconTranD ExtBankReconTranD_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ExtBankReconTranD"
    ADD CONSTRAINT "ExtBankReconTranD_pkey" PRIMARY KEY (id);


--
-- Name: ExtGstTranD ExtGstTranD_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ExtGstTranD"
    ADD CONSTRAINT "ExtGstTranD_pkey" PRIMARY KEY (id);


--
-- Name: ExtMetaTranD ExtMetaTranD_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ExtMetaTranD"
    ADD CONSTRAINT "ExtMetaTranD_pkey" PRIMARY KEY (id);


--
-- Name: FinYearM FinYearM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."FinYearM"
    ADD CONSTRAINT "FinYearM_pkey" PRIMARY KEY (id);


--
-- Name: GodownM GodownM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."GodownM"
    ADD CONSTRAINT "GodownM_pkey" PRIMARY KEY (id);


--
-- Name: InvExtD InvD_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."InvExtD"
    ADD CONSTRAINT "InvD_pkey" PRIMARY KEY (id);


--
-- Name: TranCounter LastTranNumber_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranCounter"
    ADD CONSTRAINT "LastTranNumber_pkey" PRIMARY KEY (id);


--
-- Name: Notes Notes_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT "Notes_pkey" PRIMARY KEY (id);


--
-- Name: PosM PosM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."PosM"
    ADD CONSTRAINT "PosM_pkey" PRIMARY KEY (id);


--
-- Name: ProductM ProductM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ProductM"
    ADD CONSTRAINT "ProductM_pkey" PRIMARY KEY (id);


--
-- Name: Settings Settings_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."Settings"
    ADD CONSTRAINT "Settings_pkey" PRIMARY KEY (id);


--
-- Name: TranD TranD_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranD"
    ADD CONSTRAINT "TranD_pkey" PRIMARY KEY (id);


--
-- Name: TranH TranH_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranH"
    ADD CONSTRAINT "TranH_pkey" PRIMARY KEY (id);


--
-- Name: UnitM UnitM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."UnitM"
    ADD CONSTRAINT "UnitM_pkey" PRIMARY KEY (id);


--
-- Name: TranTypeM VoucherTypeM_pkey; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranTypeM"
    ADD CONSTRAINT "VoucherTypeM_pkey" PRIMARY KEY (id);


--
-- Name: BrandM brandName; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BrandM"
    ADD CONSTRAINT "brandName" UNIQUE ("brandName");


--
-- Name: CategoryM catName; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."CategoryM"
    ADD CONSTRAINT "catName" UNIQUE ("catName");


--
-- Name: AccClassM className; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccClassM"
    ADD CONSTRAINT "className" UNIQUE ("accClass");


--
-- Name: FinYearM endDate; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."FinYearM"
    ADD CONSTRAINT "endDate" UNIQUE ("endDate");


--
-- Name: TranCounter finYearBranchTranType; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranCounter"
    ADD CONSTRAINT "finYearBranchTranType" UNIQUE ("finYearId", "branchId", "tranTypeId");


--
-- Name: GodownM gwCode; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."GodownM"
    ADD CONSTRAINT "gwCode" UNIQUE ("godCode");


--
-- Name: Settings key; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."Settings"
    ADD CONSTRAINT key UNIQUE (key);


--
-- Name: FinYearM startDate; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."FinYearM"
    ADD CONSTRAINT "startDate" UNIQUE ("startDate");


--
-- Name: UnitM unitName; Type: CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."UnitM"
    ADD CONSTRAINT "unitName" UNIQUE ("unitName");


--
-- Name: fki_branchId; Type: INDEX; Schema: public; Owner: webadmin
--

CREATE INDEX "fki_branchId" ON public."PosM" USING btree ("branchId");


--
-- Name: fki_finYearId; Type: INDEX; Schema: public; Owner: webadmin
--

CREATE INDEX "fki_finYearId" ON public."AccOpBal" USING btree ("finYearId");


--
-- Name: fki_posId; Type: INDEX; Schema: public; Owner: webadmin
--

CREATE INDEX "fki_posId" ON public."TranH" USING btree ("posId");


--
-- Name: fki_unitId; Type: INDEX; Schema: public; Owner: webadmin
--

CREATE INDEX "fki_unitId" ON public."ProductM" USING btree ("unitId");


--
-- Name: AccM  parentId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccM"
    ADD CONSTRAINT " parentId" FOREIGN KEY ("parentId") REFERENCES public."AccM"(id);


--
-- Name: AccOpBal AccOpBal_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccOpBal"
    ADD CONSTRAINT "AccOpBal_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."BranchM"(id) NOT VALID;


--
-- Name: BankOpBal BankOpBal_accId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BankOpBal"
    ADD CONSTRAINT "BankOpBal_accId_fkey" FOREIGN KEY ("accId") REFERENCES public."AccM"(id) NOT VALID;


--
-- Name: BankOpBal BankOpBal_finYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."BankOpBal"
    ADD CONSTRAINT "BankOpBal_finYearId_fkey" FOREIGN KEY ("finYearId") REFERENCES public."FinYearM"(id) NOT VALID;


--
-- Name: ExtBankReconTranD ExtBankReconTranD_tranDetailsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ExtBankReconTranD"
    ADD CONSTRAINT "ExtBankReconTranD_tranDetailsId_fkey" FOREIGN KEY ("tranDetailsId") REFERENCES public."TranD"(id);


--
-- Name: AccOpBal accId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccOpBal"
    ADD CONSTRAINT "accId" FOREIGN KEY ("accId") REFERENCES public."AccM"(id);


--
-- Name: TranD accId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranD"
    ADD CONSTRAINT "accId" FOREIGN KEY ("accId") REFERENCES public."AccM"(id);


--
-- Name: Notes brId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT "brId" FOREIGN KEY ("branchId") REFERENCES public."BranchM"(id);


--
-- Name: TranH branchId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranH"
    ADD CONSTRAINT "branchId" FOREIGN KEY ("branchId") REFERENCES public."BranchM"(id);


--
-- Name: PosM branchId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."PosM"
    ADD CONSTRAINT "branchId" FOREIGN KEY ("branchId") REFERENCES public."BranchM"(id);


--
-- Name: ProductM brandId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ProductM"
    ADD CONSTRAINT "brandId" FOREIGN KEY ("brandId") REFERENCES public."BrandM"(id);


--
-- Name: ProductM catId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ProductM"
    ADD CONSTRAINT "catId" FOREIGN KEY ("catId") REFERENCES public."CategoryM"(id);


--
-- Name: AccOpBal finYearId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."AccOpBal"
    ADD CONSTRAINT "finYearId" FOREIGN KEY ("finYearId") REFERENCES public."FinYearM"(id) NOT VALID;


--
-- Name: TranH finYearId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranH"
    ADD CONSTRAINT "finYearId" FOREIGN KEY ("finYearId") REFERENCES public."FinYearM"(id);


--
-- Name: CategoryM parentId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."CategoryM"
    ADD CONSTRAINT "parentId" FOREIGN KEY ("parentId") REFERENCES public."CategoryM"(id);


--
-- Name: TranH posId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranH"
    ADD CONSTRAINT "posId" FOREIGN KEY ("posId") REFERENCES public."PosM"(id);


--
-- Name: InvExtD prId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."InvExtD"
    ADD CONSTRAINT "prId" FOREIGN KEY ("prId") REFERENCES public."ProductM"(id);


--
-- Name: InvExtD tranDetailsId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."InvExtD"
    ADD CONSTRAINT "tranDetailsId" FOREIGN KEY (id) REFERENCES public."TranD"(id);


--
-- Name: ExtMetaTranD tranDetailsId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ExtMetaTranD"
    ADD CONSTRAINT "tranDetailsId" FOREIGN KEY ("tranDetailsId") REFERENCES public."TranD"(id) ON DELETE CASCADE;


--
-- Name: ExtGstTranD tranDetailsId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ExtGstTranD"
    ADD CONSTRAINT "tranDetailsId" FOREIGN KEY ("tranDetailsId") REFERENCES public."TranD"(id) ON DELETE CASCADE;


--
-- Name: TranD tranHeaderId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranD"
    ADD CONSTRAINT "tranHeaderId" FOREIGN KEY ("tranHeaderId") REFERENCES public."TranH"(id) ON DELETE CASCADE;


--
-- Name: TranH tranTypeId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."TranH"
    ADD CONSTRAINT "tranTypeId" FOREIGN KEY ("tranTypeId") REFERENCES public."TranTypeM"(id);


--
-- Name: ProductM unitId; Type: FK CONSTRAINT; Schema: public; Owner: webadmin
--

ALTER TABLE ONLY public."ProductM"
    ADD CONSTRAINT "unitId" FOREIGN KEY ("unitId") REFERENCES public."UnitM"(id);


--
-- PostgreSQL database dump complete
--

