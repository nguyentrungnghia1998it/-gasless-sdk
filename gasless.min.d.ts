declare module "pow/crypto" {
    export const DEFAULT_RANDOM_SIZE = 32;
    export function rng(size?: number): bigint;
    export function randomInRange(min: number | bigint, max: number | bigint): bigint;
    export function sha256(msg: string): string;
}
declare module "pow/types" {
    export type Signature = string;
    export type Solution = bigint;
    export type QuestionObject = {
        difficulty: string;
        salt: string;
        hash: string;
    };
    export class Question {
        readonly difficulty: bigint;
        readonly salt: bigint;
        readonly hash: string;
        constructor(difficulty: bigint, salt: bigint, hash: string);
        static fromObject(obj: QuestionObject): Question;
        toObject(): QuestionObject;
        toString(): string;
    }
    export class Puzzle {
        readonly question: Question;
        readonly solution: Solution;
        constructor(question: Question, solution: Solution);
        toObject(): object;
        toString(): string;
        key(): string;
    }
}
declare module "pow/puzzle" {
    import { Solution, Puzzle, Question } from "pow/types";
    type HashParams = {
        salt: bigint;
        solution: bigint;
    };
    export class POWPuzzle {
        constructor();
        static generate(difficulty: bigint): Puzzle;
        static solve(question: Question, onResult: (solution: Solution, question: Question) => void): void;
        static solveAsync(question: Question): Promise<Solution>;
        static isValidSolution(input: HashParams, target: string): boolean;
        static hashSolution(hashParams: HashParams): string;
        static estimateDifficulty(seconds: number): bigint;
        static estimateTime(difficulty: bigint): {
            avgTime: number;
            maxTime: number;
        };
        /**
         *
         * @returns time in milliseconds to hash 1M times
         */
        static time1MHashes(): number;
        static estimateNumHashes(difficulty: bigint): bigint;
    }
}
declare module "pow/index" {
    export * from "pow/puzzle";
    export * from "pow/types";
    export * from "pow/crypto";
}
declare module "gasless/types" {
    import { QuestionObject } from "pow/index";
    export type NetworkConfig = {
        name: string;
        genesisHash: string;
        gasLessServiceURL: string;
    };
    export enum GaslessTypes {
        POW = "pow",
        Dapp = "dapp",
        Pay = "pay"
    }
    export type SignedPuzzle = {
        question: QuestionObject;
        expired: number;
        signature: string;
        feePayer: string;
    };
    export type RawSubmitSolution = {
        address: string;
        solution: string;
    } & SignedPuzzle;
}
declare module "gasless/api" {
    import { Connection, Transaction, PublicKey } from "@solana/web3.js";
    import { GaslessTypes, NetworkConfig, SignedPuzzle, RawSubmitSolution } from "gasless/types";
    export function getNetwork(connection: Connection): Promise<NetworkConfig>;
    export function getGaslessInfo(connection: Connection): Promise<{
        feePayer: PublicKey;
    }>;
    export function sendToGasless(connection: Connection, signed: Transaction, type: GaslessTypes): Promise<string>;
    export function getPuzzle(connection: Connection, address: PublicKey): Promise<SignedPuzzle>;
    export function postSolution(connection: Connection, rawSolution: RawSubmitSolution, signed: Transaction): Promise<string>;
}
declare module "dapp/artifacts/index" {
    import { PublicKey } from "@solana/web3.js";
    import { BorshCoder } from "@project-serum/anchor";
    import { NetworkConfig } from "gasless/index";
    export type Artifact = {
        name: string;
        programId: PublicKey;
        coder: BorshCoder;
    };
    export type DappInfo = {
        name: string;
        programId: string;
        idl: Object;
    };
    export function loadArtifacts(network: NetworkConfig): Artifact[];
}
declare module "helpers/decoder/types" {
    /** Instructions defined by the program */
    export enum TokenInstruction {
        InitializeMint = 0,
        InitializeAccount = 1,
        InitializeMultisig = 2,
        Transfer = 3,
        Approve = 4,
        Revoke = 5,
        SetAuthority = 6,
        MintTo = 7,
        Burn = 8,
        CloseAccount = 9,
        FreezeAccount = 10,
        ThawAccount = 11,
        TransferChecked = 12,
        ApproveChecked = 13,
        MintToChecked = 14,
        BurnChecked = 15,
        InitializeAccount2 = 16,
        SyncNative = 17,
        InitializeAccount3 = 18,
        InitializeMultisig2 = 19,
        InitializeMint2 = 20,
        GetAccountDataSize = 21,
        InitializeImmutableOwner = 22,
        AmountToUiAmount = 23,
        UiAmountToAmount = 24,
        InitializeMintCloseAuthority = 25,
        TransferFeeExtension = 26,
        ConfidentialTransferExtension = 27,
        DefaultAccountStateExtension = 28,
        Reallocate = 29,
        MemoTransferExtension = 30,
        CreateNativeMint = 31,
        InitializeNonTransferableMint = 32,
        InterestBearingMintExtension = 33,
        CpiGuardExtension = 34,
        InitializePermanentDelegate = 35
    }
    export enum AssociatedTokenInstruction {
        Create = 0
    }
}
declare module "helpers/decoder/errors" {
    /** Base class for errors */
    export abstract class TokenError extends Error {
        constructor(message?: string);
    }
    /** Thrown if an account is not found at the expected address */
    export class TokenAccountNotFoundError extends TokenError {
        name: string;
    }
    /** Thrown if a program state account is not a valid Account */
    export class TokenInvalidAccountError extends TokenError {
        name: string;
    }
    /** Thrown if a program state account is not owned by the expected token program */
    export class TokenInvalidAccountOwnerError extends TokenError {
        name: string;
    }
    /** Thrown if the byte length of an program state account doesn't match the expected size */
    export class TokenInvalidAccountSizeError extends TokenError {
        name: string;
    }
    /** Thrown if the mint of a token account doesn't match the expected mint */
    export class TokenInvalidMintError extends TokenError {
        name: string;
    }
    /** Thrown if the owner of a token account doesn't match the expected owner */
    export class TokenInvalidOwnerError extends TokenError {
        name: string;
    }
    /** Thrown if the owner of a token account is a PDA (Program Derived Address) */
    export class TokenOwnerOffCurveError extends TokenError {
        name: string;
    }
    /** Thrown if an instruction's program is invalid */
    export class TokenInvalidInstructionProgramError extends TokenError {
        name: string;
    }
    /** Thrown if an instruction's keys are invalid */
    export class TokenInvalidInstructionKeysError extends TokenError {
        name: string;
    }
    /** Thrown if an instruction's data is invalid */
    export class TokenInvalidInstructionDataError extends TokenError {
        name: string;
    }
    /** Thrown if an instruction's type is invalid */
    export class TokenInvalidInstructionTypeError extends TokenError {
        name: string;
    }
    /** Thrown if the program does not support the desired instruction */
    export class TokenUnsupportedInstructionError extends TokenError {
        name: string;
    }
}
declare module "helpers/decoder/closeAccountIx" {
    import type { AccountMeta } from "@solana/web3.js";
    import { PublicKey, TransactionInstruction } from "@solana/web3.js";
    import { TokenInstruction } from "helpers/decoder/types";
    /** TODO: docs */
    export interface CloseAccountInstructionData {
        instruction: TokenInstruction.CloseAccount;
    }
    /** TODO: docs */
    export const closeAccountInstructionData: import("@solana/buffer-layout").Structure<CloseAccountInstructionData>;
    /** A decoded, valid CloseAccount instruction */
    export interface DecodedCloseAccountInstruction {
        programId: PublicKey;
        keys: {
            account: AccountMeta;
            destination: AccountMeta;
            authority: AccountMeta;
            multiSigners: AccountMeta[];
        };
        data: {
            instruction: TokenInstruction.CloseAccount;
        };
    }
    /** A decoded, non-validated CloseAccount instruction */
    export interface DecodedCloseAccountInstructionUnchecked {
        programId: PublicKey;
        keys: {
            account: AccountMeta | undefined;
            destination: AccountMeta | undefined;
            authority: AccountMeta | undefined;
            multiSigners: AccountMeta[];
        };
        data: {
            instruction: number;
        };
    }
    /**
     * Decode a CloseAccount instruction and validate it
     *
     * @param instruction Transaction instruction to decode
     * @param programId   SPL Token program account
     *
     * @return Decoded, valid instruction
     */
    export function decodeCloseAccountInstruction(instruction: TransactionInstruction, programId?: PublicKey): DecodedCloseAccountInstruction;
    /**
     * Decode a CloseAccount instruction without validating it
     *
     * @param instruction Transaction instruction to decode
     *
     * @return Decoded, non-validated instruction
     */
    export function decodeCloseAccountInstructionUnchecked({ programId, keys: [account, destination, authority, ...multiSigners], data, }: TransactionInstruction): DecodedCloseAccountInstructionUnchecked;
}
declare module "helpers/decoder/initializeAccountIx" {
    import type { AccountMeta } from "@solana/web3.js";
    import { PublicKey, TransactionInstruction } from "@solana/web3.js";
    import { TokenInstruction } from "helpers/decoder/types";
    /** TODO: docs */
    export interface InitializeAccountInstructionData {
        instruction: TokenInstruction.InitializeAccount;
    }
    /** TODO: docs */
    export const initializeAccountInstructionData: import("@solana/buffer-layout").Structure<InitializeAccountInstructionData>;
    /** A decoded, valid InitializeAccount instruction */
    export interface DecodedInitializeAccountInstruction {
        programId: PublicKey;
        keys: {
            account: AccountMeta;
            mint: AccountMeta;
            owner: AccountMeta;
            rent: AccountMeta;
        };
        data: {
            instruction: TokenInstruction.InitializeAccount;
        };
    }
    /** A decoded, non-validated InitializeAccount instruction */
    export interface DecodedInitializeAccountInstructionUnchecked {
        programId: PublicKey;
        keys: {
            account: AccountMeta | undefined;
            mint: AccountMeta | undefined;
            owner: AccountMeta | undefined;
            rent: AccountMeta | undefined;
        };
        data: {
            instruction: number;
        };
    }
    /**
     * Decode an InitializeAccount instruction and validate it
     *
     * @param instruction Transaction instruction to decode
     * @param programId   SPL Token program account
     *
     * @return Decoded, valid instruction
     */
    export function decodeInitializeAccountInstruction(instruction: TransactionInstruction, programId?: PublicKey): DecodedInitializeAccountInstruction;
    /**
     * Decode an InitializeAccount instruction without validating it
     *
     * @param instruction Transaction instruction to decode
     *
     * @return Decoded, non-validated instruction
     */
    export function decodeInitializeAccountInstructionUnchecked({ programId, keys: [account, mint, owner, rent], data, }: TransactionInstruction): DecodedInitializeAccountInstructionUnchecked;
}
declare module "helpers/decoder/createATAIx" {
    import type { AccountMeta } from "@solana/web3.js";
    import { PublicKey, TransactionInstruction } from "@solana/web3.js";
    import { AssociatedTokenInstruction } from "helpers/decoder/types";
    export interface CreateAssociatedTokenInstructionData {
        instruction: AssociatedTokenInstruction.Create;
    }
    export const createAssociatedTokenInstructionData: import("@solana/buffer-layout").Structure<CreateAssociatedTokenInstructionData>;
    export interface DecodedCreateAssociatedTokenInstruction {
        programId: PublicKey;
        keys: {
            fundingAccount: AccountMeta;
            ataAccount: AccountMeta;
            wallet: AccountMeta;
            mint: AccountMeta;
            systemProgram: AccountMeta;
            splTokenProgram: AccountMeta;
        };
        data: {
            instruction: AssociatedTokenInstruction.Create;
        };
    }
    export interface DecodedCreateAssociatedTokenInstructionUnchecked {
        programId: PublicKey;
        keys: {
            fundingAccount: AccountMeta | undefined;
            ataAccount: AccountMeta | undefined;
            wallet: AccountMeta | undefined;
            mint: AccountMeta | undefined;
            systemProgram: AccountMeta | undefined;
            splTokenProgram: AccountMeta | undefined;
        };
        data: {
            instruction: AssociatedTokenInstruction.Create;
        };
    }
    export function decodeCreateAssociatedTokenInstruction(instruction: TransactionInstruction, programId?: PublicKey): DecodedCreateAssociatedTokenInstruction;
    export function decodeCreateAssociatedTokenInstructionUnchecked({ programId, keys: [fundingAccount, ataAccount, wallet, mint, systemProgram, splTokenProgram], data, }: TransactionInstruction): DecodedCreateAssociatedTokenInstructionUnchecked;
}
declare module "helpers/decoder/index" {
    export * from "helpers/decoder/closeAccountIx";
    export * from "helpers/decoder/initializeAccountIx";
    export * from "helpers/decoder/createATAIx";
}
declare module "helpers/token-util" {
    import { Transaction, PublicKey } from "@solana/web3.js";
    /**
     * @category Util
     */
    export class TokenUtil {
        /**
         *
         * @param transaction
         * @returns Number of InitializeTokenAccount instructions
         */
        static hasInitializeNativeTokenAccountIx(transaction: Transaction): PublicKey | null;
        /**
         *
         * @param transaction
         * @returns Number of CloseAccountInstruction instructions
         */
        static hasCloseTokenAccountIx(transaction: Transaction, closedAccount: PublicKey): boolean;
        static replaceFundingAccountOfCreateATAIx(transaction: Transaction, feePayer: PublicKey): Transaction;
    }
}
declare module "dapp/dapp-utils" {
    import { Connection, PublicKey, TransactionInstruction, Transaction } from "@solana/web3.js";
    import { Artifact } from "dapp/artifacts/index";
    export type DappInstruction = {
        name: string;
        decodedData: object;
    } & TransactionInstruction;
    export class GaslessDapp {
        readonly connection: Connection;
        readonly dapps: Artifact[];
        constructor(connection: Connection, dapps: Artifact[]);
        static new(connection: Connection): Promise<GaslessDapp>;
        decodeTransaction(transaction: Transaction): DappInstruction[];
        hasDappInstruction(transaction: Transaction): boolean;
        addBorrowRepayForRentExemption(transaction: Transaction, wallet: PublicKey, feePayer: PublicKey): Promise<Transaction>;
        build(transaction: Transaction, wallet: PublicKey, feePayer: PublicKey): Promise<Transaction>;
    }
}
declare module "dapp/index" {
    export * from "dapp/dapp-utils";
}
declare module "gasless/transactions-builder" {
    import { Connection, Signer, Transaction, TransactionInstruction } from "@solana/web3.js";
    import { GaslessDapp } from "dapp/index";
    import { GaslessTypes } from "gasless/types";
    import { Wallet } from "@project-serum/anchor";
    export type CompressedIx = {
        instructions: TransactionInstruction[];
        cleanupInstructions: TransactionInstruction[];
        signers: Signer[];
    };
    export class GaslessTransaction {
        readonly connection: Connection;
        readonly wallet: Wallet;
        readonly dapp: GaslessDapp;
        transaction: Transaction;
        signers: Signer[];
        gaslessType: GaslessTypes;
        constructor(connection: Connection, wallet: Wallet, dapp: GaslessDapp, gaslessType?: GaslessTypes);
        static fromTransactionBuilder(connection: Connection, wallet: Wallet, compressIx: CompressedIx, dappUtil: GaslessDapp): GaslessTransaction;
        addSigners(signers: Signer[]): GaslessTransaction;
        addInstructions(ixs: TransactionInstruction[]): GaslessTransaction;
        setGaslessType(gaslessType: GaslessTypes): GaslessTransaction;
        buildAndExecute(): Promise<string>;
        asyncBuildAndExecute(cb: (error: any, txid: string) => void): void;
    }
}
declare module "gasless/index" {
    export * from "gasless/transactions-builder";
    export * from "gasless/types";
    export * from "gasless/api";
}
declare module "helpers/index" {
    export * from "helpers/token-util";
    export * from "helpers/decoder/index";
}
declare module "index" {
    export * from "gasless/index";
    export * from "pow/index";
    export * from "dapp/index";
    export * from "helpers/index";
}
