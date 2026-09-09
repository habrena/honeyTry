
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model Classification
 * 
 */
export type Classification = $Result.DefaultSelection<Prisma.$ClassificationPayload>
/**
 * Model Patient
 * 
 */
export type Patient = $Result.DefaultSelection<Prisma.$PatientPayload>
/**
 * Model Doktor
 * 
 */
export type Doktor = $Result.DefaultSelection<Prisma.$DoktorPayload>
/**
 * Model Uloga
 * 
 */
export type Uloga = $Result.DefaultSelection<Prisma.$UlogaPayload>
/**
 * Model Termin
 * 
 */
export type Termin = $Result.DefaultSelection<Prisma.$TerminPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Sessions
 * const sessions = await prisma.session.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Sessions
   * const sessions = await prisma.session.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.classification`: Exposes CRUD operations for the **Classification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Classifications
    * const classifications = await prisma.classification.findMany()
    * ```
    */
  get classification(): Prisma.ClassificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.doktor`: Exposes CRUD operations for the **Doktor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Doktors
    * const doktors = await prisma.doktor.findMany()
    * ```
    */
  get doktor(): Prisma.DoktorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.uloga`: Exposes CRUD operations for the **Uloga** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ulogas
    * const ulogas = await prisma.uloga.findMany()
    * ```
    */
  get uloga(): Prisma.UlogaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.termin`: Exposes CRUD operations for the **Termin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Termins
    * const termins = await prisma.termin.findMany()
    * ```
    */
  get termin(): Prisma.TerminDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Session: 'Session',
    Event: 'Event',
    Classification: 'Classification',
    Patient: 'Patient',
    Doktor: 'Doktor',
    Uloga: 'Uloga',
    Termin: 'Termin'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "session" | "event" | "classification" | "patient" | "doktor" | "uloga" | "termin"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      Classification: {
        payload: Prisma.$ClassificationPayload<ExtArgs>
        fields: Prisma.ClassificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClassificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClassificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload>
          }
          findFirst: {
            args: Prisma.ClassificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClassificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload>
          }
          findMany: {
            args: Prisma.ClassificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload>[]
          }
          create: {
            args: Prisma.ClassificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload>
          }
          createMany: {
            args: Prisma.ClassificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClassificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload>[]
          }
          delete: {
            args: Prisma.ClassificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload>
          }
          update: {
            args: Prisma.ClassificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload>
          }
          deleteMany: {
            args: Prisma.ClassificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClassificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClassificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload>[]
          }
          upsert: {
            args: Prisma.ClassificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassificationPayload>
          }
          aggregate: {
            args: Prisma.ClassificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClassification>
          }
          groupBy: {
            args: Prisma.ClassificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClassificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClassificationCountArgs<ExtArgs>
            result: $Utils.Optional<ClassificationCountAggregateOutputType> | number
          }
        }
      }
      Patient: {
        payload: Prisma.$PatientPayload<ExtArgs>
        fields: Prisma.PatientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findFirst: {
            args: Prisma.PatientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findMany: {
            args: Prisma.PatientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          create: {
            args: Prisma.PatientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          createMany: {
            args: Prisma.PatientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          delete: {
            args: Prisma.PatientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          update: {
            args: Prisma.PatientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          deleteMany: {
            args: Prisma.PatientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PatientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          upsert: {
            args: Prisma.PatientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          aggregate: {
            args: Prisma.PatientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatient>
          }
          groupBy: {
            args: Prisma.PatientGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientCountArgs<ExtArgs>
            result: $Utils.Optional<PatientCountAggregateOutputType> | number
          }
        }
      }
      Doktor: {
        payload: Prisma.$DoktorPayload<ExtArgs>
        fields: Prisma.DoktorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DoktorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DoktorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload>
          }
          findFirst: {
            args: Prisma.DoktorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DoktorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload>
          }
          findMany: {
            args: Prisma.DoktorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload>[]
          }
          create: {
            args: Prisma.DoktorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload>
          }
          createMany: {
            args: Prisma.DoktorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DoktorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload>[]
          }
          delete: {
            args: Prisma.DoktorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload>
          }
          update: {
            args: Prisma.DoktorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload>
          }
          deleteMany: {
            args: Prisma.DoktorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DoktorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DoktorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload>[]
          }
          upsert: {
            args: Prisma.DoktorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoktorPayload>
          }
          aggregate: {
            args: Prisma.DoktorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDoktor>
          }
          groupBy: {
            args: Prisma.DoktorGroupByArgs<ExtArgs>
            result: $Utils.Optional<DoktorGroupByOutputType>[]
          }
          count: {
            args: Prisma.DoktorCountArgs<ExtArgs>
            result: $Utils.Optional<DoktorCountAggregateOutputType> | number
          }
        }
      }
      Uloga: {
        payload: Prisma.$UlogaPayload<ExtArgs>
        fields: Prisma.UlogaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UlogaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UlogaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload>
          }
          findFirst: {
            args: Prisma.UlogaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UlogaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload>
          }
          findMany: {
            args: Prisma.UlogaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload>[]
          }
          create: {
            args: Prisma.UlogaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload>
          }
          createMany: {
            args: Prisma.UlogaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UlogaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload>[]
          }
          delete: {
            args: Prisma.UlogaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload>
          }
          update: {
            args: Prisma.UlogaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload>
          }
          deleteMany: {
            args: Prisma.UlogaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UlogaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UlogaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload>[]
          }
          upsert: {
            args: Prisma.UlogaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UlogaPayload>
          }
          aggregate: {
            args: Prisma.UlogaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUloga>
          }
          groupBy: {
            args: Prisma.UlogaGroupByArgs<ExtArgs>
            result: $Utils.Optional<UlogaGroupByOutputType>[]
          }
          count: {
            args: Prisma.UlogaCountArgs<ExtArgs>
            result: $Utils.Optional<UlogaCountAggregateOutputType> | number
          }
        }
      }
      Termin: {
        payload: Prisma.$TerminPayload<ExtArgs>
        fields: Prisma.TerminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TerminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TerminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload>
          }
          findFirst: {
            args: Prisma.TerminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TerminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload>
          }
          findMany: {
            args: Prisma.TerminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload>[]
          }
          create: {
            args: Prisma.TerminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload>
          }
          createMany: {
            args: Prisma.TerminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TerminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload>[]
          }
          delete: {
            args: Prisma.TerminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload>
          }
          update: {
            args: Prisma.TerminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload>
          }
          deleteMany: {
            args: Prisma.TerminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TerminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TerminUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload>[]
          }
          upsert: {
            args: Prisma.TerminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TerminPayload>
          }
          aggregate: {
            args: Prisma.TerminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTermin>
          }
          groupBy: {
            args: Prisma.TerminGroupByArgs<ExtArgs>
            result: $Utils.Optional<TerminGroupByOutputType>[]
          }
          count: {
            args: Prisma.TerminCountArgs<ExtArgs>
            result: $Utils.Optional<TerminCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    session?: SessionOmit
    event?: EventOmit
    classification?: ClassificationOmit
    patient?: PatientOmit
    doktor?: DoktorOmit
    uloga?: UlogaOmit
    termin?: TerminOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SessionCountOutputType
   */

  export type SessionCountOutputType = {
    events: number
  }

  export type SessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | SessionCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * SessionCountOutputType without action
   */
  export type SessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionCountOutputType
     */
    select?: SessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SessionCountOutputType without action
   */
  export type SessionCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    tokenId: string | null
    sessionKey: string | null
    cookieId: string | null
    identMethod: string | null
    firstSeen: Date | null
    lastSeen: Date | null
    lastAnalyzedAt: Date | null
    sourceIp: string | null
    userAgent: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    tokenId: string | null
    sessionKey: string | null
    cookieId: string | null
    identMethod: string | null
    firstSeen: Date | null
    lastSeen: Date | null
    lastAnalyzedAt: Date | null
    sourceIp: string | null
    userAgent: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    tokenId: number
    sessionKey: number
    cookieId: number
    identMethod: number
    firstSeen: number
    lastSeen: number
    lastAnalyzedAt: number
    sourceIp: number
    userAgent: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    tokenId?: true
    sessionKey?: true
    cookieId?: true
    identMethod?: true
    firstSeen?: true
    lastSeen?: true
    lastAnalyzedAt?: true
    sourceIp?: true
    userAgent?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    tokenId?: true
    sessionKey?: true
    cookieId?: true
    identMethod?: true
    firstSeen?: true
    lastSeen?: true
    lastAnalyzedAt?: true
    sourceIp?: true
    userAgent?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    tokenId?: true
    sessionKey?: true
    cookieId?: true
    identMethod?: true
    firstSeen?: true
    lastSeen?: true
    lastAnalyzedAt?: true
    sourceIp?: true
    userAgent?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    tokenId: string
    sessionKey: string
    cookieId: string
    identMethod: string
    firstSeen: Date
    lastSeen: Date
    lastAnalyzedAt: Date | null
    sourceIp: string
    userAgent: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenId?: boolean
    sessionKey?: boolean
    cookieId?: boolean
    identMethod?: boolean
    firstSeen?: boolean
    lastSeen?: boolean
    lastAnalyzedAt?: boolean
    sourceIp?: boolean
    userAgent?: boolean
    events?: boolean | Session$eventsArgs<ExtArgs>
    _count?: boolean | SessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenId?: boolean
    sessionKey?: boolean
    cookieId?: boolean
    identMethod?: boolean
    firstSeen?: boolean
    lastSeen?: boolean
    lastAnalyzedAt?: boolean
    sourceIp?: boolean
    userAgent?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenId?: boolean
    sessionKey?: boolean
    cookieId?: boolean
    identMethod?: boolean
    firstSeen?: boolean
    lastSeen?: boolean
    lastAnalyzedAt?: boolean
    sourceIp?: boolean
    userAgent?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    tokenId?: boolean
    sessionKey?: boolean
    cookieId?: boolean
    identMethod?: boolean
    firstSeen?: boolean
    lastSeen?: boolean
    lastAnalyzedAt?: boolean
    sourceIp?: boolean
    userAgent?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tokenId" | "sessionKey" | "cookieId" | "identMethod" | "firstSeen" | "lastSeen" | "lastAnalyzedAt" | "sourceIp" | "userAgent", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | Session$eventsArgs<ExtArgs>
    _count?: boolean | SessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      events: Prisma.$EventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tokenId: string
      sessionKey: string
      cookieId: string
      identMethod: string
      firstSeen: Date
      lastSeen: Date
      lastAnalyzedAt: Date | null
      sourceIp: string
      userAgent: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    events<T extends Session$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Session$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly tokenId: FieldRef<"Session", 'String'>
    readonly sessionKey: FieldRef<"Session", 'String'>
    readonly cookieId: FieldRef<"Session", 'String'>
    readonly identMethod: FieldRef<"Session", 'String'>
    readonly firstSeen: FieldRef<"Session", 'DateTime'>
    readonly lastSeen: FieldRef<"Session", 'DateTime'>
    readonly lastAnalyzedAt: FieldRef<"Session", 'DateTime'>
    readonly sourceIp: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session.events
   */
  export type Session$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    statusCode: number | null
    durationMs: number | null
    analyzeCount: number | null
  }

  export type EventSumAggregateOutputType = {
    statusCode: number | null
    durationMs: number | null
    analyzeCount: number | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    timestamp: Date | null
    eventType: string | null
    method: string | null
    endpoint: string | null
    statusCode: number | null
    durationMs: number | null
    contentType: string | null
    referer: string | null
    origin: string | null
    analyzedAt: Date | null
    analyzeCount: number | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    timestamp: Date | null
    eventType: string | null
    method: string | null
    endpoint: string | null
    statusCode: number | null
    durationMs: number | null
    contentType: string | null
    referer: string | null
    origin: string | null
    analyzedAt: Date | null
    analyzeCount: number | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    sessionId: number
    timestamp: number
    eventType: number
    method: number
    endpoint: number
    statusCode: number
    durationMs: number
    queryParams: number
    body: number
    headers: number
    contentType: number
    referer: number
    origin: number
    analyzedAt: number
    analyzeCount: number
    metadata: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    statusCode?: true
    durationMs?: true
    analyzeCount?: true
  }

  export type EventSumAggregateInputType = {
    statusCode?: true
    durationMs?: true
    analyzeCount?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    sessionId?: true
    timestamp?: true
    eventType?: true
    method?: true
    endpoint?: true
    statusCode?: true
    durationMs?: true
    contentType?: true
    referer?: true
    origin?: true
    analyzedAt?: true
    analyzeCount?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    sessionId?: true
    timestamp?: true
    eventType?: true
    method?: true
    endpoint?: true
    statusCode?: true
    durationMs?: true
    contentType?: true
    referer?: true
    origin?: true
    analyzedAt?: true
    analyzeCount?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    sessionId?: true
    timestamp?: true
    eventType?: true
    method?: true
    endpoint?: true
    statusCode?: true
    durationMs?: true
    queryParams?: true
    body?: true
    headers?: true
    contentType?: true
    referer?: true
    origin?: true
    analyzedAt?: true
    analyzeCount?: true
    metadata?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    sessionId: string
    timestamp: Date
    eventType: string | null
    method: string
    endpoint: string
    statusCode: number | null
    durationMs: number | null
    queryParams: JsonValue | null
    body: JsonValue | null
    headers: JsonValue | null
    contentType: string | null
    referer: string | null
    origin: string | null
    analyzedAt: Date | null
    analyzeCount: number
    metadata: JsonValue | null
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    timestamp?: boolean
    eventType?: boolean
    method?: boolean
    endpoint?: boolean
    statusCode?: boolean
    durationMs?: boolean
    queryParams?: boolean
    body?: boolean
    headers?: boolean
    contentType?: boolean
    referer?: boolean
    origin?: boolean
    analyzedAt?: boolean
    analyzeCount?: boolean
    metadata?: boolean
    session?: boolean | SessionDefaultArgs<ExtArgs>
    classification?: boolean | Event$classificationArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    timestamp?: boolean
    eventType?: boolean
    method?: boolean
    endpoint?: boolean
    statusCode?: boolean
    durationMs?: boolean
    queryParams?: boolean
    body?: boolean
    headers?: boolean
    contentType?: boolean
    referer?: boolean
    origin?: boolean
    analyzedAt?: boolean
    analyzeCount?: boolean
    metadata?: boolean
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    timestamp?: boolean
    eventType?: boolean
    method?: boolean
    endpoint?: boolean
    statusCode?: boolean
    durationMs?: boolean
    queryParams?: boolean
    body?: boolean
    headers?: boolean
    contentType?: boolean
    referer?: boolean
    origin?: boolean
    analyzedAt?: boolean
    analyzeCount?: boolean
    metadata?: boolean
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    sessionId?: boolean
    timestamp?: boolean
    eventType?: boolean
    method?: boolean
    endpoint?: boolean
    statusCode?: boolean
    durationMs?: boolean
    queryParams?: boolean
    body?: boolean
    headers?: boolean
    contentType?: boolean
    referer?: boolean
    origin?: boolean
    analyzedAt?: boolean
    analyzeCount?: boolean
    metadata?: boolean
  }

  export type EventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "timestamp" | "eventType" | "method" | "endpoint" | "statusCode" | "durationMs" | "queryParams" | "body" | "headers" | "contentType" | "referer" | "origin" | "analyzedAt" | "analyzeCount" | "metadata", ExtArgs["result"]["event"]>
  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | SessionDefaultArgs<ExtArgs>
    classification?: boolean | Event$classificationArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }
  export type EventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      session: Prisma.$SessionPayload<ExtArgs>
      classification: Prisma.$ClassificationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      timestamp: Date
      eventType: string | null
      method: string
      endpoint: string
      statusCode: number | null
      durationMs: number | null
      queryParams: Prisma.JsonValue | null
      body: Prisma.JsonValue | null
      headers: Prisma.JsonValue | null
      contentType: string | null
      referer: string | null
      origin: string | null
      analyzedAt: Date | null
      analyzeCount: number
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(args: SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends SessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SessionDefaultArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    classification<T extends Event$classificationArgs<ExtArgs> = {}>(args?: Subset<T, Event$classificationArgs<ExtArgs>>): Prisma__ClassificationClient<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'String'>
    readonly sessionId: FieldRef<"Event", 'String'>
    readonly timestamp: FieldRef<"Event", 'DateTime'>
    readonly eventType: FieldRef<"Event", 'String'>
    readonly method: FieldRef<"Event", 'String'>
    readonly endpoint: FieldRef<"Event", 'String'>
    readonly statusCode: FieldRef<"Event", 'Int'>
    readonly durationMs: FieldRef<"Event", 'Int'>
    readonly queryParams: FieldRef<"Event", 'Json'>
    readonly body: FieldRef<"Event", 'Json'>
    readonly headers: FieldRef<"Event", 'Json'>
    readonly contentType: FieldRef<"Event", 'String'>
    readonly referer: FieldRef<"Event", 'String'>
    readonly origin: FieldRef<"Event", 'String'>
    readonly analyzedAt: FieldRef<"Event", 'DateTime'>
    readonly analyzeCount: FieldRef<"Event", 'Int'>
    readonly metadata: FieldRef<"Event", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event updateManyAndReturn
   */
  export type EventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to delete.
     */
    limit?: number
  }

  /**
   * Event.classification
   */
  export type Event$classificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    where?: ClassificationWhereInput
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model Classification
   */

  export type AggregateClassification = {
    _count: ClassificationCountAggregateOutputType | null
    _avg: ClassificationAvgAggregateOutputType | null
    _sum: ClassificationSumAggregateOutputType | null
    _min: ClassificationMinAggregateOutputType | null
    _max: ClassificationMaxAggregateOutputType | null
  }

  export type ClassificationAvgAggregateOutputType = {
    confidence: number | null
  }

  export type ClassificationSumAggregateOutputType = {
    confidence: number | null
  }

  export type ClassificationMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    createdAt: Date | null
    detector: string | null
    category: string | null
    confidence: number | null
    severity: string | null
    explanation: string | null
  }

  export type ClassificationMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    createdAt: Date | null
    detector: string | null
    category: string | null
    confidence: number | null
    severity: string | null
    explanation: string | null
  }

  export type ClassificationCountAggregateOutputType = {
    id: number
    eventId: number
    createdAt: number
    detector: number
    category: number
    confidence: number
    severity: number
    explanation: number
    _all: number
  }


  export type ClassificationAvgAggregateInputType = {
    confidence?: true
  }

  export type ClassificationSumAggregateInputType = {
    confidence?: true
  }

  export type ClassificationMinAggregateInputType = {
    id?: true
    eventId?: true
    createdAt?: true
    detector?: true
    category?: true
    confidence?: true
    severity?: true
    explanation?: true
  }

  export type ClassificationMaxAggregateInputType = {
    id?: true
    eventId?: true
    createdAt?: true
    detector?: true
    category?: true
    confidence?: true
    severity?: true
    explanation?: true
  }

  export type ClassificationCountAggregateInputType = {
    id?: true
    eventId?: true
    createdAt?: true
    detector?: true
    category?: true
    confidence?: true
    severity?: true
    explanation?: true
    _all?: true
  }

  export type ClassificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Classification to aggregate.
     */
    where?: ClassificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classifications to fetch.
     */
    orderBy?: ClassificationOrderByWithRelationInput | ClassificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClassificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Classifications
    **/
    _count?: true | ClassificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClassificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClassificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClassificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClassificationMaxAggregateInputType
  }

  export type GetClassificationAggregateType<T extends ClassificationAggregateArgs> = {
        [P in keyof T & keyof AggregateClassification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClassification[P]>
      : GetScalarType<T[P], AggregateClassification[P]>
  }




  export type ClassificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassificationWhereInput
    orderBy?: ClassificationOrderByWithAggregationInput | ClassificationOrderByWithAggregationInput[]
    by: ClassificationScalarFieldEnum[] | ClassificationScalarFieldEnum
    having?: ClassificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClassificationCountAggregateInputType | true
    _avg?: ClassificationAvgAggregateInputType
    _sum?: ClassificationSumAggregateInputType
    _min?: ClassificationMinAggregateInputType
    _max?: ClassificationMaxAggregateInputType
  }

  export type ClassificationGroupByOutputType = {
    id: string
    eventId: string
    createdAt: Date
    detector: string
    category: string
    confidence: number
    severity: string | null
    explanation: string | null
    _count: ClassificationCountAggregateOutputType | null
    _avg: ClassificationAvgAggregateOutputType | null
    _sum: ClassificationSumAggregateOutputType | null
    _min: ClassificationMinAggregateOutputType | null
    _max: ClassificationMaxAggregateOutputType | null
  }

  type GetClassificationGroupByPayload<T extends ClassificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClassificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClassificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClassificationGroupByOutputType[P]>
            : GetScalarType<T[P], ClassificationGroupByOutputType[P]>
        }
      >
    >


  export type ClassificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    createdAt?: boolean
    detector?: boolean
    category?: boolean
    confidence?: boolean
    severity?: boolean
    explanation?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classification"]>

  export type ClassificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    createdAt?: boolean
    detector?: boolean
    category?: boolean
    confidence?: boolean
    severity?: boolean
    explanation?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classification"]>

  export type ClassificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    createdAt?: boolean
    detector?: boolean
    category?: boolean
    confidence?: boolean
    severity?: boolean
    explanation?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classification"]>

  export type ClassificationSelectScalar = {
    id?: boolean
    eventId?: boolean
    createdAt?: boolean
    detector?: boolean
    category?: boolean
    confidence?: boolean
    severity?: boolean
    explanation?: boolean
  }

  export type ClassificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventId" | "createdAt" | "detector" | "category" | "confidence" | "severity" | "explanation", ExtArgs["result"]["classification"]>
  export type ClassificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type ClassificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type ClassificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $ClassificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Classification"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      createdAt: Date
      detector: string
      category: string
      confidence: number
      severity: string | null
      explanation: string | null
    }, ExtArgs["result"]["classification"]>
    composites: {}
  }

  type ClassificationGetPayload<S extends boolean | null | undefined | ClassificationDefaultArgs> = $Result.GetResult<Prisma.$ClassificationPayload, S>

  type ClassificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClassificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClassificationCountAggregateInputType | true
    }

  export interface ClassificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Classification'], meta: { name: 'Classification' } }
    /**
     * Find zero or one Classification that matches the filter.
     * @param {ClassificationFindUniqueArgs} args - Arguments to find a Classification
     * @example
     * // Get one Classification
     * const classification = await prisma.classification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClassificationFindUniqueArgs>(args: SelectSubset<T, ClassificationFindUniqueArgs<ExtArgs>>): Prisma__ClassificationClient<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Classification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClassificationFindUniqueOrThrowArgs} args - Arguments to find a Classification
     * @example
     * // Get one Classification
     * const classification = await prisma.classification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClassificationFindUniqueOrThrowArgs>(args: SelectSubset<T, ClassificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClassificationClient<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Classification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassificationFindFirstArgs} args - Arguments to find a Classification
     * @example
     * // Get one Classification
     * const classification = await prisma.classification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClassificationFindFirstArgs>(args?: SelectSubset<T, ClassificationFindFirstArgs<ExtArgs>>): Prisma__ClassificationClient<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Classification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassificationFindFirstOrThrowArgs} args - Arguments to find a Classification
     * @example
     * // Get one Classification
     * const classification = await prisma.classification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClassificationFindFirstOrThrowArgs>(args?: SelectSubset<T, ClassificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClassificationClient<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Classifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Classifications
     * const classifications = await prisma.classification.findMany()
     * 
     * // Get first 10 Classifications
     * const classifications = await prisma.classification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const classificationWithIdOnly = await prisma.classification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClassificationFindManyArgs>(args?: SelectSubset<T, ClassificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Classification.
     * @param {ClassificationCreateArgs} args - Arguments to create a Classification.
     * @example
     * // Create one Classification
     * const Classification = await prisma.classification.create({
     *   data: {
     *     // ... data to create a Classification
     *   }
     * })
     * 
     */
    create<T extends ClassificationCreateArgs>(args: SelectSubset<T, ClassificationCreateArgs<ExtArgs>>): Prisma__ClassificationClient<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Classifications.
     * @param {ClassificationCreateManyArgs} args - Arguments to create many Classifications.
     * @example
     * // Create many Classifications
     * const classification = await prisma.classification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClassificationCreateManyArgs>(args?: SelectSubset<T, ClassificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Classifications and returns the data saved in the database.
     * @param {ClassificationCreateManyAndReturnArgs} args - Arguments to create many Classifications.
     * @example
     * // Create many Classifications
     * const classification = await prisma.classification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Classifications and only return the `id`
     * const classificationWithIdOnly = await prisma.classification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClassificationCreateManyAndReturnArgs>(args?: SelectSubset<T, ClassificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Classification.
     * @param {ClassificationDeleteArgs} args - Arguments to delete one Classification.
     * @example
     * // Delete one Classification
     * const Classification = await prisma.classification.delete({
     *   where: {
     *     // ... filter to delete one Classification
     *   }
     * })
     * 
     */
    delete<T extends ClassificationDeleteArgs>(args: SelectSubset<T, ClassificationDeleteArgs<ExtArgs>>): Prisma__ClassificationClient<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Classification.
     * @param {ClassificationUpdateArgs} args - Arguments to update one Classification.
     * @example
     * // Update one Classification
     * const classification = await prisma.classification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClassificationUpdateArgs>(args: SelectSubset<T, ClassificationUpdateArgs<ExtArgs>>): Prisma__ClassificationClient<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Classifications.
     * @param {ClassificationDeleteManyArgs} args - Arguments to filter Classifications to delete.
     * @example
     * // Delete a few Classifications
     * const { count } = await prisma.classification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClassificationDeleteManyArgs>(args?: SelectSubset<T, ClassificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Classifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Classifications
     * const classification = await prisma.classification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClassificationUpdateManyArgs>(args: SelectSubset<T, ClassificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Classifications and returns the data updated in the database.
     * @param {ClassificationUpdateManyAndReturnArgs} args - Arguments to update many Classifications.
     * @example
     * // Update many Classifications
     * const classification = await prisma.classification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Classifications and only return the `id`
     * const classificationWithIdOnly = await prisma.classification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClassificationUpdateManyAndReturnArgs>(args: SelectSubset<T, ClassificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Classification.
     * @param {ClassificationUpsertArgs} args - Arguments to update or create a Classification.
     * @example
     * // Update or create a Classification
     * const classification = await prisma.classification.upsert({
     *   create: {
     *     // ... data to create a Classification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Classification we want to update
     *   }
     * })
     */
    upsert<T extends ClassificationUpsertArgs>(args: SelectSubset<T, ClassificationUpsertArgs<ExtArgs>>): Prisma__ClassificationClient<$Result.GetResult<Prisma.$ClassificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Classifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassificationCountArgs} args - Arguments to filter Classifications to count.
     * @example
     * // Count the number of Classifications
     * const count = await prisma.classification.count({
     *   where: {
     *     // ... the filter for the Classifications we want to count
     *   }
     * })
    **/
    count<T extends ClassificationCountArgs>(
      args?: Subset<T, ClassificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClassificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Classification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClassificationAggregateArgs>(args: Subset<T, ClassificationAggregateArgs>): Prisma.PrismaPromise<GetClassificationAggregateType<T>>

    /**
     * Group by Classification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClassificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClassificationGroupByArgs['orderBy'] }
        : { orderBy?: ClassificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClassificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Classification model
   */
  readonly fields: ClassificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Classification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClassificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Classification model
   */
  interface ClassificationFieldRefs {
    readonly id: FieldRef<"Classification", 'String'>
    readonly eventId: FieldRef<"Classification", 'String'>
    readonly createdAt: FieldRef<"Classification", 'DateTime'>
    readonly detector: FieldRef<"Classification", 'String'>
    readonly category: FieldRef<"Classification", 'String'>
    readonly confidence: FieldRef<"Classification", 'Float'>
    readonly severity: FieldRef<"Classification", 'String'>
    readonly explanation: FieldRef<"Classification", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Classification findUnique
   */
  export type ClassificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    /**
     * Filter, which Classification to fetch.
     */
    where: ClassificationWhereUniqueInput
  }

  /**
   * Classification findUniqueOrThrow
   */
  export type ClassificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    /**
     * Filter, which Classification to fetch.
     */
    where: ClassificationWhereUniqueInput
  }

  /**
   * Classification findFirst
   */
  export type ClassificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    /**
     * Filter, which Classification to fetch.
     */
    where?: ClassificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classifications to fetch.
     */
    orderBy?: ClassificationOrderByWithRelationInput | ClassificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Classifications.
     */
    cursor?: ClassificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Classifications.
     */
    distinct?: ClassificationScalarFieldEnum | ClassificationScalarFieldEnum[]
  }

  /**
   * Classification findFirstOrThrow
   */
  export type ClassificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    /**
     * Filter, which Classification to fetch.
     */
    where?: ClassificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classifications to fetch.
     */
    orderBy?: ClassificationOrderByWithRelationInput | ClassificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Classifications.
     */
    cursor?: ClassificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Classifications.
     */
    distinct?: ClassificationScalarFieldEnum | ClassificationScalarFieldEnum[]
  }

  /**
   * Classification findMany
   */
  export type ClassificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    /**
     * Filter, which Classifications to fetch.
     */
    where?: ClassificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classifications to fetch.
     */
    orderBy?: ClassificationOrderByWithRelationInput | ClassificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Classifications.
     */
    cursor?: ClassificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Classifications.
     */
    distinct?: ClassificationScalarFieldEnum | ClassificationScalarFieldEnum[]
  }

  /**
   * Classification create
   */
  export type ClassificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Classification.
     */
    data: XOR<ClassificationCreateInput, ClassificationUncheckedCreateInput>
  }

  /**
   * Classification createMany
   */
  export type ClassificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Classifications.
     */
    data: ClassificationCreateManyInput | ClassificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Classification createManyAndReturn
   */
  export type ClassificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * The data used to create many Classifications.
     */
    data: ClassificationCreateManyInput | ClassificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Classification update
   */
  export type ClassificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Classification.
     */
    data: XOR<ClassificationUpdateInput, ClassificationUncheckedUpdateInput>
    /**
     * Choose, which Classification to update.
     */
    where: ClassificationWhereUniqueInput
  }

  /**
   * Classification updateMany
   */
  export type ClassificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Classifications.
     */
    data: XOR<ClassificationUpdateManyMutationInput, ClassificationUncheckedUpdateManyInput>
    /**
     * Filter which Classifications to update
     */
    where?: ClassificationWhereInput
    /**
     * Limit how many Classifications to update.
     */
    limit?: number
  }

  /**
   * Classification updateManyAndReturn
   */
  export type ClassificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * The data used to update Classifications.
     */
    data: XOR<ClassificationUpdateManyMutationInput, ClassificationUncheckedUpdateManyInput>
    /**
     * Filter which Classifications to update
     */
    where?: ClassificationWhereInput
    /**
     * Limit how many Classifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Classification upsert
   */
  export type ClassificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Classification to update in case it exists.
     */
    where: ClassificationWhereUniqueInput
    /**
     * In case the Classification found by the `where` argument doesn't exist, create a new Classification with this data.
     */
    create: XOR<ClassificationCreateInput, ClassificationUncheckedCreateInput>
    /**
     * In case the Classification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClassificationUpdateInput, ClassificationUncheckedUpdateInput>
  }

  /**
   * Classification delete
   */
  export type ClassificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
    /**
     * Filter which Classification to delete.
     */
    where: ClassificationWhereUniqueInput
  }

  /**
   * Classification deleteMany
   */
  export type ClassificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Classifications to delete
     */
    where?: ClassificationWhereInput
    /**
     * Limit how many Classifications to delete.
     */
    limit?: number
  }

  /**
   * Classification without action
   */
  export type ClassificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classification
     */
    select?: ClassificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classification
     */
    omit?: ClassificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassificationInclude<ExtArgs> | null
  }


  /**
   * Model Patient
   */

  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientMinAggregateOutputType = {
    id: string | null
    name: string | null
    surname: string | null
    jmbg: string | null
    dateOfBirth: Date | null
    gender: string | null
    phoneNumber: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientMaxAggregateOutputType = {
    id: string | null
    name: string | null
    surname: string | null
    jmbg: string | null
    dateOfBirth: Date | null
    gender: string | null
    phoneNumber: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    name: number
    surname: number
    jmbg: number
    dateOfBirth: number
    gender: number
    phoneNumber: number
    address: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientMinAggregateInputType = {
    id?: true
    name?: true
    surname?: true
    jmbg?: true
    dateOfBirth?: true
    gender?: true
    phoneNumber?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    name?: true
    surname?: true
    jmbg?: true
    dateOfBirth?: true
    gender?: true
    phoneNumber?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    name?: true
    surname?: true
    jmbg?: true
    dateOfBirth?: true
    gender?: true
    phoneNumber?: true
    address?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patient to aggregate.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithAggregationInput | PatientOrderByWithAggregationInput[]
    by: PatientScalarFieldEnum[] | PatientScalarFieldEnum
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }

  export type PatientGroupByOutputType = {
    id: string
    name: string
    surname: string
    jmbg: string
    dateOfBirth: Date
    gender: string
    phoneNumber: string
    address: string
    createdAt: Date
    updatedAt: Date
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    surname?: boolean
    jmbg?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    phoneNumber?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    surname?: boolean
    jmbg?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    phoneNumber?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    surname?: boolean
    jmbg?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    phoneNumber?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectScalar = {
    id?: boolean
    name?: boolean
    surname?: boolean
    jmbg?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    phoneNumber?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "surname" | "jmbg" | "dateOfBirth" | "gender" | "phoneNumber" | "address" | "createdAt" | "updatedAt", ExtArgs["result"]["patient"]>

  export type $PatientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Patient"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      surname: string
      jmbg: string
      dateOfBirth: Date
      gender: string
      phoneNumber: string
      address: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patient"]>
    composites: {}
  }

  type PatientGetPayload<S extends boolean | null | undefined | PatientDefaultArgs> = $Result.GetResult<Prisma.$PatientPayload, S>

  type PatientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PatientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PatientCountAggregateInputType | true
    }

  export interface PatientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Patient'], meta: { name: 'Patient' } }
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientFindUniqueArgs>(args: SelectSubset<T, PatientFindUniqueArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Patient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientFindFirstArgs>(args?: SelectSubset<T, PatientFindFirstArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientFindManyArgs>(args?: SelectSubset<T, PatientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
     */
    create<T extends PatientCreateArgs>(args: SelectSubset<T, PatientCreateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Patients.
     * @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientCreateManyArgs>(args?: SelectSubset<T, PatientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Patients and returns the data saved in the database.
     * @param {PatientCreateManyAndReturnArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
     */
    delete<T extends PatientDeleteArgs>(args: SelectSubset<T, PatientDeleteArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientUpdateArgs>(args: SelectSubset<T, PatientUpdateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDeleteManyArgs>(args?: SelectSubset<T, PatientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientUpdateManyArgs>(args: SelectSubset<T, PatientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients and returns the data updated in the database.
     * @param {PatientUpdateManyAndReturnArgs} args - Arguments to update many Patients.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PatientUpdateManyAndReturnArgs>(args: SelectSubset<T, PatientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
     */
    upsert<T extends PatientUpsertArgs>(args: SelectSubset<T, PatientUpsertArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): Prisma.PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Patient model
   */
  readonly fields: PatientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Patient model
   */
  interface PatientFieldRefs {
    readonly id: FieldRef<"Patient", 'String'>
    readonly name: FieldRef<"Patient", 'String'>
    readonly surname: FieldRef<"Patient", 'String'>
    readonly jmbg: FieldRef<"Patient", 'String'>
    readonly dateOfBirth: FieldRef<"Patient", 'DateTime'>
    readonly gender: FieldRef<"Patient", 'String'>
    readonly phoneNumber: FieldRef<"Patient", 'String'>
    readonly address: FieldRef<"Patient", 'String'>
    readonly createdAt: FieldRef<"Patient", 'DateTime'>
    readonly updatedAt: FieldRef<"Patient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Patient findUnique
   */
  export type PatientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findFirst
   */
  export type PatientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patients to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient create
   */
  export type PatientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data needed to create a Patient.
     */
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }

  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient createManyAndReturn
   */
  export type PatientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient update
   */
  export type PatientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data needed to update a Patient.
     */
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient updateManyAndReturn
   */
  export type PatientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient upsert
   */
  export type PatientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The filter to search for the Patient to update in case it exists.
     */
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     */
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }

  /**
   * Patient delete
   */
  export type PatientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter which Patient to delete.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patients to delete
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to delete.
     */
    limit?: number
  }

  /**
   * Patient without action
   */
  export type PatientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
  }


  /**
   * Model Doktor
   */

  export type AggregateDoktor = {
    _count: DoktorCountAggregateOutputType | null
    _avg: DoktorAvgAggregateOutputType | null
    _sum: DoktorSumAggregateOutputType | null
    _min: DoktorMinAggregateOutputType | null
    _max: DoktorMaxAggregateOutputType | null
  }

  export type DoktorAvgAggregateOutputType = {
    id: number | null
    ukupno: number | null
    brojZakazanih: number | null
    brojSlobodnih: number | null
  }

  export type DoktorSumAggregateOutputType = {
    id: number | null
    ukupno: number | null
    brojZakazanih: number | null
    brojSlobodnih: number | null
  }

  export type DoktorMinAggregateOutputType = {
    id: number | null
    ime: string | null
    prezime: string | null
    odjel: string | null
    ukupno: number | null
    brojZakazanih: number | null
    brojSlobodnih: number | null
  }

  export type DoktorMaxAggregateOutputType = {
    id: number | null
    ime: string | null
    prezime: string | null
    odjel: string | null
    ukupno: number | null
    brojZakazanih: number | null
    brojSlobodnih: number | null
  }

  export type DoktorCountAggregateOutputType = {
    id: number
    ime: number
    prezime: number
    odjel: number
    ukupno: number
    brojZakazanih: number
    brojSlobodnih: number
    _all: number
  }


  export type DoktorAvgAggregateInputType = {
    id?: true
    ukupno?: true
    brojZakazanih?: true
    brojSlobodnih?: true
  }

  export type DoktorSumAggregateInputType = {
    id?: true
    ukupno?: true
    brojZakazanih?: true
    brojSlobodnih?: true
  }

  export type DoktorMinAggregateInputType = {
    id?: true
    ime?: true
    prezime?: true
    odjel?: true
    ukupno?: true
    brojZakazanih?: true
    brojSlobodnih?: true
  }

  export type DoktorMaxAggregateInputType = {
    id?: true
    ime?: true
    prezime?: true
    odjel?: true
    ukupno?: true
    brojZakazanih?: true
    brojSlobodnih?: true
  }

  export type DoktorCountAggregateInputType = {
    id?: true
    ime?: true
    prezime?: true
    odjel?: true
    ukupno?: true
    brojZakazanih?: true
    brojSlobodnih?: true
    _all?: true
  }

  export type DoktorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Doktor to aggregate.
     */
    where?: DoktorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doktors to fetch.
     */
    orderBy?: DoktorOrderByWithRelationInput | DoktorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DoktorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doktors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doktors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Doktors
    **/
    _count?: true | DoktorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DoktorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DoktorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DoktorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DoktorMaxAggregateInputType
  }

  export type GetDoktorAggregateType<T extends DoktorAggregateArgs> = {
        [P in keyof T & keyof AggregateDoktor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDoktor[P]>
      : GetScalarType<T[P], AggregateDoktor[P]>
  }




  export type DoktorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DoktorWhereInput
    orderBy?: DoktorOrderByWithAggregationInput | DoktorOrderByWithAggregationInput[]
    by: DoktorScalarFieldEnum[] | DoktorScalarFieldEnum
    having?: DoktorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DoktorCountAggregateInputType | true
    _avg?: DoktorAvgAggregateInputType
    _sum?: DoktorSumAggregateInputType
    _min?: DoktorMinAggregateInputType
    _max?: DoktorMaxAggregateInputType
  }

  export type DoktorGroupByOutputType = {
    id: number
    ime: string
    prezime: string
    odjel: string
    ukupno: number
    brojZakazanih: number
    brojSlobodnih: number
    _count: DoktorCountAggregateOutputType | null
    _avg: DoktorAvgAggregateOutputType | null
    _sum: DoktorSumAggregateOutputType | null
    _min: DoktorMinAggregateOutputType | null
    _max: DoktorMaxAggregateOutputType | null
  }

  type GetDoktorGroupByPayload<T extends DoktorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DoktorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DoktorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DoktorGroupByOutputType[P]>
            : GetScalarType<T[P], DoktorGroupByOutputType[P]>
        }
      >
    >


  export type DoktorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ime?: boolean
    prezime?: boolean
    odjel?: boolean
    ukupno?: boolean
    brojZakazanih?: boolean
    brojSlobodnih?: boolean
  }, ExtArgs["result"]["doktor"]>

  export type DoktorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ime?: boolean
    prezime?: boolean
    odjel?: boolean
    ukupno?: boolean
    brojZakazanih?: boolean
    brojSlobodnih?: boolean
  }, ExtArgs["result"]["doktor"]>

  export type DoktorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ime?: boolean
    prezime?: boolean
    odjel?: boolean
    ukupno?: boolean
    brojZakazanih?: boolean
    brojSlobodnih?: boolean
  }, ExtArgs["result"]["doktor"]>

  export type DoktorSelectScalar = {
    id?: boolean
    ime?: boolean
    prezime?: boolean
    odjel?: boolean
    ukupno?: boolean
    brojZakazanih?: boolean
    brojSlobodnih?: boolean
  }

  export type DoktorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ime" | "prezime" | "odjel" | "ukupno" | "brojZakazanih" | "brojSlobodnih", ExtArgs["result"]["doktor"]>

  export type $DoktorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Doktor"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      ime: string
      prezime: string
      odjel: string
      ukupno: number
      brojZakazanih: number
      brojSlobodnih: number
    }, ExtArgs["result"]["doktor"]>
    composites: {}
  }

  type DoktorGetPayload<S extends boolean | null | undefined | DoktorDefaultArgs> = $Result.GetResult<Prisma.$DoktorPayload, S>

  type DoktorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DoktorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DoktorCountAggregateInputType | true
    }

  export interface DoktorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Doktor'], meta: { name: 'Doktor' } }
    /**
     * Find zero or one Doktor that matches the filter.
     * @param {DoktorFindUniqueArgs} args - Arguments to find a Doktor
     * @example
     * // Get one Doktor
     * const doktor = await prisma.doktor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DoktorFindUniqueArgs>(args: SelectSubset<T, DoktorFindUniqueArgs<ExtArgs>>): Prisma__DoktorClient<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Doktor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DoktorFindUniqueOrThrowArgs} args - Arguments to find a Doktor
     * @example
     * // Get one Doktor
     * const doktor = await prisma.doktor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DoktorFindUniqueOrThrowArgs>(args: SelectSubset<T, DoktorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DoktorClient<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Doktor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoktorFindFirstArgs} args - Arguments to find a Doktor
     * @example
     * // Get one Doktor
     * const doktor = await prisma.doktor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DoktorFindFirstArgs>(args?: SelectSubset<T, DoktorFindFirstArgs<ExtArgs>>): Prisma__DoktorClient<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Doktor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoktorFindFirstOrThrowArgs} args - Arguments to find a Doktor
     * @example
     * // Get one Doktor
     * const doktor = await prisma.doktor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DoktorFindFirstOrThrowArgs>(args?: SelectSubset<T, DoktorFindFirstOrThrowArgs<ExtArgs>>): Prisma__DoktorClient<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Doktors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoktorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Doktors
     * const doktors = await prisma.doktor.findMany()
     * 
     * // Get first 10 Doktors
     * const doktors = await prisma.doktor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const doktorWithIdOnly = await prisma.doktor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DoktorFindManyArgs>(args?: SelectSubset<T, DoktorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Doktor.
     * @param {DoktorCreateArgs} args - Arguments to create a Doktor.
     * @example
     * // Create one Doktor
     * const Doktor = await prisma.doktor.create({
     *   data: {
     *     // ... data to create a Doktor
     *   }
     * })
     * 
     */
    create<T extends DoktorCreateArgs>(args: SelectSubset<T, DoktorCreateArgs<ExtArgs>>): Prisma__DoktorClient<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Doktors.
     * @param {DoktorCreateManyArgs} args - Arguments to create many Doktors.
     * @example
     * // Create many Doktors
     * const doktor = await prisma.doktor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DoktorCreateManyArgs>(args?: SelectSubset<T, DoktorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Doktors and returns the data saved in the database.
     * @param {DoktorCreateManyAndReturnArgs} args - Arguments to create many Doktors.
     * @example
     * // Create many Doktors
     * const doktor = await prisma.doktor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Doktors and only return the `id`
     * const doktorWithIdOnly = await prisma.doktor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DoktorCreateManyAndReturnArgs>(args?: SelectSubset<T, DoktorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Doktor.
     * @param {DoktorDeleteArgs} args - Arguments to delete one Doktor.
     * @example
     * // Delete one Doktor
     * const Doktor = await prisma.doktor.delete({
     *   where: {
     *     // ... filter to delete one Doktor
     *   }
     * })
     * 
     */
    delete<T extends DoktorDeleteArgs>(args: SelectSubset<T, DoktorDeleteArgs<ExtArgs>>): Prisma__DoktorClient<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Doktor.
     * @param {DoktorUpdateArgs} args - Arguments to update one Doktor.
     * @example
     * // Update one Doktor
     * const doktor = await prisma.doktor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DoktorUpdateArgs>(args: SelectSubset<T, DoktorUpdateArgs<ExtArgs>>): Prisma__DoktorClient<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Doktors.
     * @param {DoktorDeleteManyArgs} args - Arguments to filter Doktors to delete.
     * @example
     * // Delete a few Doktors
     * const { count } = await prisma.doktor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DoktorDeleteManyArgs>(args?: SelectSubset<T, DoktorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Doktors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoktorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Doktors
     * const doktor = await prisma.doktor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DoktorUpdateManyArgs>(args: SelectSubset<T, DoktorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Doktors and returns the data updated in the database.
     * @param {DoktorUpdateManyAndReturnArgs} args - Arguments to update many Doktors.
     * @example
     * // Update many Doktors
     * const doktor = await prisma.doktor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Doktors and only return the `id`
     * const doktorWithIdOnly = await prisma.doktor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DoktorUpdateManyAndReturnArgs>(args: SelectSubset<T, DoktorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Doktor.
     * @param {DoktorUpsertArgs} args - Arguments to update or create a Doktor.
     * @example
     * // Update or create a Doktor
     * const doktor = await prisma.doktor.upsert({
     *   create: {
     *     // ... data to create a Doktor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Doktor we want to update
     *   }
     * })
     */
    upsert<T extends DoktorUpsertArgs>(args: SelectSubset<T, DoktorUpsertArgs<ExtArgs>>): Prisma__DoktorClient<$Result.GetResult<Prisma.$DoktorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Doktors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoktorCountArgs} args - Arguments to filter Doktors to count.
     * @example
     * // Count the number of Doktors
     * const count = await prisma.doktor.count({
     *   where: {
     *     // ... the filter for the Doktors we want to count
     *   }
     * })
    **/
    count<T extends DoktorCountArgs>(
      args?: Subset<T, DoktorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DoktorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Doktor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoktorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DoktorAggregateArgs>(args: Subset<T, DoktorAggregateArgs>): Prisma.PrismaPromise<GetDoktorAggregateType<T>>

    /**
     * Group by Doktor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoktorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DoktorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DoktorGroupByArgs['orderBy'] }
        : { orderBy?: DoktorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DoktorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDoktorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Doktor model
   */
  readonly fields: DoktorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Doktor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DoktorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Doktor model
   */
  interface DoktorFieldRefs {
    readonly id: FieldRef<"Doktor", 'Int'>
    readonly ime: FieldRef<"Doktor", 'String'>
    readonly prezime: FieldRef<"Doktor", 'String'>
    readonly odjel: FieldRef<"Doktor", 'String'>
    readonly ukupno: FieldRef<"Doktor", 'Int'>
    readonly brojZakazanih: FieldRef<"Doktor", 'Int'>
    readonly brojSlobodnih: FieldRef<"Doktor", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Doktor findUnique
   */
  export type DoktorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * Filter, which Doktor to fetch.
     */
    where: DoktorWhereUniqueInput
  }

  /**
   * Doktor findUniqueOrThrow
   */
  export type DoktorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * Filter, which Doktor to fetch.
     */
    where: DoktorWhereUniqueInput
  }

  /**
   * Doktor findFirst
   */
  export type DoktorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * Filter, which Doktor to fetch.
     */
    where?: DoktorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doktors to fetch.
     */
    orderBy?: DoktorOrderByWithRelationInput | DoktorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Doktors.
     */
    cursor?: DoktorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doktors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doktors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Doktors.
     */
    distinct?: DoktorScalarFieldEnum | DoktorScalarFieldEnum[]
  }

  /**
   * Doktor findFirstOrThrow
   */
  export type DoktorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * Filter, which Doktor to fetch.
     */
    where?: DoktorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doktors to fetch.
     */
    orderBy?: DoktorOrderByWithRelationInput | DoktorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Doktors.
     */
    cursor?: DoktorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doktors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doktors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Doktors.
     */
    distinct?: DoktorScalarFieldEnum | DoktorScalarFieldEnum[]
  }

  /**
   * Doktor findMany
   */
  export type DoktorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * Filter, which Doktors to fetch.
     */
    where?: DoktorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doktors to fetch.
     */
    orderBy?: DoktorOrderByWithRelationInput | DoktorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Doktors.
     */
    cursor?: DoktorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doktors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doktors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Doktors.
     */
    distinct?: DoktorScalarFieldEnum | DoktorScalarFieldEnum[]
  }

  /**
   * Doktor create
   */
  export type DoktorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * The data needed to create a Doktor.
     */
    data: XOR<DoktorCreateInput, DoktorUncheckedCreateInput>
  }

  /**
   * Doktor createMany
   */
  export type DoktorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Doktors.
     */
    data: DoktorCreateManyInput | DoktorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Doktor createManyAndReturn
   */
  export type DoktorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * The data used to create many Doktors.
     */
    data: DoktorCreateManyInput | DoktorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Doktor update
   */
  export type DoktorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * The data needed to update a Doktor.
     */
    data: XOR<DoktorUpdateInput, DoktorUncheckedUpdateInput>
    /**
     * Choose, which Doktor to update.
     */
    where: DoktorWhereUniqueInput
  }

  /**
   * Doktor updateMany
   */
  export type DoktorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Doktors.
     */
    data: XOR<DoktorUpdateManyMutationInput, DoktorUncheckedUpdateManyInput>
    /**
     * Filter which Doktors to update
     */
    where?: DoktorWhereInput
    /**
     * Limit how many Doktors to update.
     */
    limit?: number
  }

  /**
   * Doktor updateManyAndReturn
   */
  export type DoktorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * The data used to update Doktors.
     */
    data: XOR<DoktorUpdateManyMutationInput, DoktorUncheckedUpdateManyInput>
    /**
     * Filter which Doktors to update
     */
    where?: DoktorWhereInput
    /**
     * Limit how many Doktors to update.
     */
    limit?: number
  }

  /**
   * Doktor upsert
   */
  export type DoktorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * The filter to search for the Doktor to update in case it exists.
     */
    where: DoktorWhereUniqueInput
    /**
     * In case the Doktor found by the `where` argument doesn't exist, create a new Doktor with this data.
     */
    create: XOR<DoktorCreateInput, DoktorUncheckedCreateInput>
    /**
     * In case the Doktor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DoktorUpdateInput, DoktorUncheckedUpdateInput>
  }

  /**
   * Doktor delete
   */
  export type DoktorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
    /**
     * Filter which Doktor to delete.
     */
    where: DoktorWhereUniqueInput
  }

  /**
   * Doktor deleteMany
   */
  export type DoktorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Doktors to delete
     */
    where?: DoktorWhereInput
    /**
     * Limit how many Doktors to delete.
     */
    limit?: number
  }

  /**
   * Doktor without action
   */
  export type DoktorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doktor
     */
    select?: DoktorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doktor
     */
    omit?: DoktorOmit<ExtArgs> | null
  }


  /**
   * Model Uloga
   */

  export type AggregateUloga = {
    _count: UlogaCountAggregateOutputType | null
    _avg: UlogaAvgAggregateOutputType | null
    _sum: UlogaSumAggregateOutputType | null
    _min: UlogaMinAggregateOutputType | null
    _max: UlogaMaxAggregateOutputType | null
  }

  export type UlogaAvgAggregateOutputType = {
    id: number | null
    broj: number | null
  }

  export type UlogaSumAggregateOutputType = {
    id: number | null
    broj: number | null
  }

  export type UlogaMinAggregateOutputType = {
    id: number | null
    uloga: string | null
    broj: number | null
  }

  export type UlogaMaxAggregateOutputType = {
    id: number | null
    uloga: string | null
    broj: number | null
  }

  export type UlogaCountAggregateOutputType = {
    id: number
    uloga: number
    broj: number
    _all: number
  }


  export type UlogaAvgAggregateInputType = {
    id?: true
    broj?: true
  }

  export type UlogaSumAggregateInputType = {
    id?: true
    broj?: true
  }

  export type UlogaMinAggregateInputType = {
    id?: true
    uloga?: true
    broj?: true
  }

  export type UlogaMaxAggregateInputType = {
    id?: true
    uloga?: true
    broj?: true
  }

  export type UlogaCountAggregateInputType = {
    id?: true
    uloga?: true
    broj?: true
    _all?: true
  }

  export type UlogaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Uloga to aggregate.
     */
    where?: UlogaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ulogas to fetch.
     */
    orderBy?: UlogaOrderByWithRelationInput | UlogaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UlogaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ulogas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ulogas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ulogas
    **/
    _count?: true | UlogaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UlogaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UlogaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UlogaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UlogaMaxAggregateInputType
  }

  export type GetUlogaAggregateType<T extends UlogaAggregateArgs> = {
        [P in keyof T & keyof AggregateUloga]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUloga[P]>
      : GetScalarType<T[P], AggregateUloga[P]>
  }




  export type UlogaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UlogaWhereInput
    orderBy?: UlogaOrderByWithAggregationInput | UlogaOrderByWithAggregationInput[]
    by: UlogaScalarFieldEnum[] | UlogaScalarFieldEnum
    having?: UlogaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UlogaCountAggregateInputType | true
    _avg?: UlogaAvgAggregateInputType
    _sum?: UlogaSumAggregateInputType
    _min?: UlogaMinAggregateInputType
    _max?: UlogaMaxAggregateInputType
  }

  export type UlogaGroupByOutputType = {
    id: number
    uloga: string
    broj: number
    _count: UlogaCountAggregateOutputType | null
    _avg: UlogaAvgAggregateOutputType | null
    _sum: UlogaSumAggregateOutputType | null
    _min: UlogaMinAggregateOutputType | null
    _max: UlogaMaxAggregateOutputType | null
  }

  type GetUlogaGroupByPayload<T extends UlogaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UlogaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UlogaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UlogaGroupByOutputType[P]>
            : GetScalarType<T[P], UlogaGroupByOutputType[P]>
        }
      >
    >


  export type UlogaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uloga?: boolean
    broj?: boolean
  }, ExtArgs["result"]["uloga"]>

  export type UlogaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uloga?: boolean
    broj?: boolean
  }, ExtArgs["result"]["uloga"]>

  export type UlogaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uloga?: boolean
    broj?: boolean
  }, ExtArgs["result"]["uloga"]>

  export type UlogaSelectScalar = {
    id?: boolean
    uloga?: boolean
    broj?: boolean
  }

  export type UlogaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uloga" | "broj", ExtArgs["result"]["uloga"]>

  export type $UlogaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Uloga"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uloga: string
      broj: number
    }, ExtArgs["result"]["uloga"]>
    composites: {}
  }

  type UlogaGetPayload<S extends boolean | null | undefined | UlogaDefaultArgs> = $Result.GetResult<Prisma.$UlogaPayload, S>

  type UlogaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UlogaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UlogaCountAggregateInputType | true
    }

  export interface UlogaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Uloga'], meta: { name: 'Uloga' } }
    /**
     * Find zero or one Uloga that matches the filter.
     * @param {UlogaFindUniqueArgs} args - Arguments to find a Uloga
     * @example
     * // Get one Uloga
     * const uloga = await prisma.uloga.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UlogaFindUniqueArgs>(args: SelectSubset<T, UlogaFindUniqueArgs<ExtArgs>>): Prisma__UlogaClient<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Uloga that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UlogaFindUniqueOrThrowArgs} args - Arguments to find a Uloga
     * @example
     * // Get one Uloga
     * const uloga = await prisma.uloga.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UlogaFindUniqueOrThrowArgs>(args: SelectSubset<T, UlogaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UlogaClient<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Uloga that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UlogaFindFirstArgs} args - Arguments to find a Uloga
     * @example
     * // Get one Uloga
     * const uloga = await prisma.uloga.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UlogaFindFirstArgs>(args?: SelectSubset<T, UlogaFindFirstArgs<ExtArgs>>): Prisma__UlogaClient<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Uloga that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UlogaFindFirstOrThrowArgs} args - Arguments to find a Uloga
     * @example
     * // Get one Uloga
     * const uloga = await prisma.uloga.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UlogaFindFirstOrThrowArgs>(args?: SelectSubset<T, UlogaFindFirstOrThrowArgs<ExtArgs>>): Prisma__UlogaClient<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ulogas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UlogaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ulogas
     * const ulogas = await prisma.uloga.findMany()
     * 
     * // Get first 10 Ulogas
     * const ulogas = await prisma.uloga.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ulogaWithIdOnly = await prisma.uloga.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UlogaFindManyArgs>(args?: SelectSubset<T, UlogaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Uloga.
     * @param {UlogaCreateArgs} args - Arguments to create a Uloga.
     * @example
     * // Create one Uloga
     * const Uloga = await prisma.uloga.create({
     *   data: {
     *     // ... data to create a Uloga
     *   }
     * })
     * 
     */
    create<T extends UlogaCreateArgs>(args: SelectSubset<T, UlogaCreateArgs<ExtArgs>>): Prisma__UlogaClient<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ulogas.
     * @param {UlogaCreateManyArgs} args - Arguments to create many Ulogas.
     * @example
     * // Create many Ulogas
     * const uloga = await prisma.uloga.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UlogaCreateManyArgs>(args?: SelectSubset<T, UlogaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ulogas and returns the data saved in the database.
     * @param {UlogaCreateManyAndReturnArgs} args - Arguments to create many Ulogas.
     * @example
     * // Create many Ulogas
     * const uloga = await prisma.uloga.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ulogas and only return the `id`
     * const ulogaWithIdOnly = await prisma.uloga.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UlogaCreateManyAndReturnArgs>(args?: SelectSubset<T, UlogaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Uloga.
     * @param {UlogaDeleteArgs} args - Arguments to delete one Uloga.
     * @example
     * // Delete one Uloga
     * const Uloga = await prisma.uloga.delete({
     *   where: {
     *     // ... filter to delete one Uloga
     *   }
     * })
     * 
     */
    delete<T extends UlogaDeleteArgs>(args: SelectSubset<T, UlogaDeleteArgs<ExtArgs>>): Prisma__UlogaClient<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Uloga.
     * @param {UlogaUpdateArgs} args - Arguments to update one Uloga.
     * @example
     * // Update one Uloga
     * const uloga = await prisma.uloga.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UlogaUpdateArgs>(args: SelectSubset<T, UlogaUpdateArgs<ExtArgs>>): Prisma__UlogaClient<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ulogas.
     * @param {UlogaDeleteManyArgs} args - Arguments to filter Ulogas to delete.
     * @example
     * // Delete a few Ulogas
     * const { count } = await prisma.uloga.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UlogaDeleteManyArgs>(args?: SelectSubset<T, UlogaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ulogas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UlogaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ulogas
     * const uloga = await prisma.uloga.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UlogaUpdateManyArgs>(args: SelectSubset<T, UlogaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ulogas and returns the data updated in the database.
     * @param {UlogaUpdateManyAndReturnArgs} args - Arguments to update many Ulogas.
     * @example
     * // Update many Ulogas
     * const uloga = await prisma.uloga.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ulogas and only return the `id`
     * const ulogaWithIdOnly = await prisma.uloga.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UlogaUpdateManyAndReturnArgs>(args: SelectSubset<T, UlogaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Uloga.
     * @param {UlogaUpsertArgs} args - Arguments to update or create a Uloga.
     * @example
     * // Update or create a Uloga
     * const uloga = await prisma.uloga.upsert({
     *   create: {
     *     // ... data to create a Uloga
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Uloga we want to update
     *   }
     * })
     */
    upsert<T extends UlogaUpsertArgs>(args: SelectSubset<T, UlogaUpsertArgs<ExtArgs>>): Prisma__UlogaClient<$Result.GetResult<Prisma.$UlogaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ulogas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UlogaCountArgs} args - Arguments to filter Ulogas to count.
     * @example
     * // Count the number of Ulogas
     * const count = await prisma.uloga.count({
     *   where: {
     *     // ... the filter for the Ulogas we want to count
     *   }
     * })
    **/
    count<T extends UlogaCountArgs>(
      args?: Subset<T, UlogaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UlogaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Uloga.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UlogaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UlogaAggregateArgs>(args: Subset<T, UlogaAggregateArgs>): Prisma.PrismaPromise<GetUlogaAggregateType<T>>

    /**
     * Group by Uloga.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UlogaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UlogaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UlogaGroupByArgs['orderBy'] }
        : { orderBy?: UlogaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UlogaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUlogaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Uloga model
   */
  readonly fields: UlogaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Uloga.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UlogaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Uloga model
   */
  interface UlogaFieldRefs {
    readonly id: FieldRef<"Uloga", 'Int'>
    readonly uloga: FieldRef<"Uloga", 'String'>
    readonly broj: FieldRef<"Uloga", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Uloga findUnique
   */
  export type UlogaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * Filter, which Uloga to fetch.
     */
    where: UlogaWhereUniqueInput
  }

  /**
   * Uloga findUniqueOrThrow
   */
  export type UlogaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * Filter, which Uloga to fetch.
     */
    where: UlogaWhereUniqueInput
  }

  /**
   * Uloga findFirst
   */
  export type UlogaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * Filter, which Uloga to fetch.
     */
    where?: UlogaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ulogas to fetch.
     */
    orderBy?: UlogaOrderByWithRelationInput | UlogaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ulogas.
     */
    cursor?: UlogaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ulogas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ulogas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ulogas.
     */
    distinct?: UlogaScalarFieldEnum | UlogaScalarFieldEnum[]
  }

  /**
   * Uloga findFirstOrThrow
   */
  export type UlogaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * Filter, which Uloga to fetch.
     */
    where?: UlogaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ulogas to fetch.
     */
    orderBy?: UlogaOrderByWithRelationInput | UlogaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ulogas.
     */
    cursor?: UlogaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ulogas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ulogas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ulogas.
     */
    distinct?: UlogaScalarFieldEnum | UlogaScalarFieldEnum[]
  }

  /**
   * Uloga findMany
   */
  export type UlogaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * Filter, which Ulogas to fetch.
     */
    where?: UlogaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ulogas to fetch.
     */
    orderBy?: UlogaOrderByWithRelationInput | UlogaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ulogas.
     */
    cursor?: UlogaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ulogas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ulogas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ulogas.
     */
    distinct?: UlogaScalarFieldEnum | UlogaScalarFieldEnum[]
  }

  /**
   * Uloga create
   */
  export type UlogaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * The data needed to create a Uloga.
     */
    data: XOR<UlogaCreateInput, UlogaUncheckedCreateInput>
  }

  /**
   * Uloga createMany
   */
  export type UlogaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ulogas.
     */
    data: UlogaCreateManyInput | UlogaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Uloga createManyAndReturn
   */
  export type UlogaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * The data used to create many Ulogas.
     */
    data: UlogaCreateManyInput | UlogaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Uloga update
   */
  export type UlogaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * The data needed to update a Uloga.
     */
    data: XOR<UlogaUpdateInput, UlogaUncheckedUpdateInput>
    /**
     * Choose, which Uloga to update.
     */
    where: UlogaWhereUniqueInput
  }

  /**
   * Uloga updateMany
   */
  export type UlogaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ulogas.
     */
    data: XOR<UlogaUpdateManyMutationInput, UlogaUncheckedUpdateManyInput>
    /**
     * Filter which Ulogas to update
     */
    where?: UlogaWhereInput
    /**
     * Limit how many Ulogas to update.
     */
    limit?: number
  }

  /**
   * Uloga updateManyAndReturn
   */
  export type UlogaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * The data used to update Ulogas.
     */
    data: XOR<UlogaUpdateManyMutationInput, UlogaUncheckedUpdateManyInput>
    /**
     * Filter which Ulogas to update
     */
    where?: UlogaWhereInput
    /**
     * Limit how many Ulogas to update.
     */
    limit?: number
  }

  /**
   * Uloga upsert
   */
  export type UlogaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * The filter to search for the Uloga to update in case it exists.
     */
    where: UlogaWhereUniqueInput
    /**
     * In case the Uloga found by the `where` argument doesn't exist, create a new Uloga with this data.
     */
    create: XOR<UlogaCreateInput, UlogaUncheckedCreateInput>
    /**
     * In case the Uloga was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UlogaUpdateInput, UlogaUncheckedUpdateInput>
  }

  /**
   * Uloga delete
   */
  export type UlogaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
    /**
     * Filter which Uloga to delete.
     */
    where: UlogaWhereUniqueInput
  }

  /**
   * Uloga deleteMany
   */
  export type UlogaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ulogas to delete
     */
    where?: UlogaWhereInput
    /**
     * Limit how many Ulogas to delete.
     */
    limit?: number
  }

  /**
   * Uloga without action
   */
  export type UlogaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Uloga
     */
    select?: UlogaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Uloga
     */
    omit?: UlogaOmit<ExtArgs> | null
  }


  /**
   * Model Termin
   */

  export type AggregateTermin = {
    _count: TerminCountAggregateOutputType | null
    _avg: TerminAvgAggregateOutputType | null
    _sum: TerminSumAggregateOutputType | null
    _min: TerminMinAggregateOutputType | null
    _max: TerminMaxAggregateOutputType | null
  }

  export type TerminAvgAggregateOutputType = {
    id: number | null
    doktorId: number | null
    pacijentId: number | null
  }

  export type TerminSumAggregateOutputType = {
    id: number | null
    doktorId: number | null
    pacijentId: number | null
  }

  export type TerminMinAggregateOutputType = {
    id: number | null
    doktorId: number | null
    pacijentId: number | null
    datum: string | null
    razlog: string | null
    createdAt: Date | null
  }

  export type TerminMaxAggregateOutputType = {
    id: number | null
    doktorId: number | null
    pacijentId: number | null
    datum: string | null
    razlog: string | null
    createdAt: Date | null
  }

  export type TerminCountAggregateOutputType = {
    id: number
    doktorId: number
    pacijentId: number
    datum: number
    razlog: number
    createdAt: number
    _all: number
  }


  export type TerminAvgAggregateInputType = {
    id?: true
    doktorId?: true
    pacijentId?: true
  }

  export type TerminSumAggregateInputType = {
    id?: true
    doktorId?: true
    pacijentId?: true
  }

  export type TerminMinAggregateInputType = {
    id?: true
    doktorId?: true
    pacijentId?: true
    datum?: true
    razlog?: true
    createdAt?: true
  }

  export type TerminMaxAggregateInputType = {
    id?: true
    doktorId?: true
    pacijentId?: true
    datum?: true
    razlog?: true
    createdAt?: true
  }

  export type TerminCountAggregateInputType = {
    id?: true
    doktorId?: true
    pacijentId?: true
    datum?: true
    razlog?: true
    createdAt?: true
    _all?: true
  }

  export type TerminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Termin to aggregate.
     */
    where?: TerminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Termins to fetch.
     */
    orderBy?: TerminOrderByWithRelationInput | TerminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TerminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Termins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Termins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Termins
    **/
    _count?: true | TerminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TerminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TerminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TerminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TerminMaxAggregateInputType
  }

  export type GetTerminAggregateType<T extends TerminAggregateArgs> = {
        [P in keyof T & keyof AggregateTermin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTermin[P]>
      : GetScalarType<T[P], AggregateTermin[P]>
  }




  export type TerminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TerminWhereInput
    orderBy?: TerminOrderByWithAggregationInput | TerminOrderByWithAggregationInput[]
    by: TerminScalarFieldEnum[] | TerminScalarFieldEnum
    having?: TerminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TerminCountAggregateInputType | true
    _avg?: TerminAvgAggregateInputType
    _sum?: TerminSumAggregateInputType
    _min?: TerminMinAggregateInputType
    _max?: TerminMaxAggregateInputType
  }

  export type TerminGroupByOutputType = {
    id: number
    doktorId: number
    pacijentId: number | null
    datum: string
    razlog: string | null
    createdAt: Date
    _count: TerminCountAggregateOutputType | null
    _avg: TerminAvgAggregateOutputType | null
    _sum: TerminSumAggregateOutputType | null
    _min: TerminMinAggregateOutputType | null
    _max: TerminMaxAggregateOutputType | null
  }

  type GetTerminGroupByPayload<T extends TerminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TerminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TerminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TerminGroupByOutputType[P]>
            : GetScalarType<T[P], TerminGroupByOutputType[P]>
        }
      >
    >


  export type TerminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    doktorId?: boolean
    pacijentId?: boolean
    datum?: boolean
    razlog?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["termin"]>

  export type TerminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    doktorId?: boolean
    pacijentId?: boolean
    datum?: boolean
    razlog?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["termin"]>

  export type TerminSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    doktorId?: boolean
    pacijentId?: boolean
    datum?: boolean
    razlog?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["termin"]>

  export type TerminSelectScalar = {
    id?: boolean
    doktorId?: boolean
    pacijentId?: boolean
    datum?: boolean
    razlog?: boolean
    createdAt?: boolean
  }

  export type TerminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "doktorId" | "pacijentId" | "datum" | "razlog" | "createdAt", ExtArgs["result"]["termin"]>

  export type $TerminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Termin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      doktorId: number
      pacijentId: number | null
      datum: string
      razlog: string | null
      createdAt: Date
    }, ExtArgs["result"]["termin"]>
    composites: {}
  }

  type TerminGetPayload<S extends boolean | null | undefined | TerminDefaultArgs> = $Result.GetResult<Prisma.$TerminPayload, S>

  type TerminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TerminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TerminCountAggregateInputType | true
    }

  export interface TerminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Termin'], meta: { name: 'Termin' } }
    /**
     * Find zero or one Termin that matches the filter.
     * @param {TerminFindUniqueArgs} args - Arguments to find a Termin
     * @example
     * // Get one Termin
     * const termin = await prisma.termin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TerminFindUniqueArgs>(args: SelectSubset<T, TerminFindUniqueArgs<ExtArgs>>): Prisma__TerminClient<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Termin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TerminFindUniqueOrThrowArgs} args - Arguments to find a Termin
     * @example
     * // Get one Termin
     * const termin = await prisma.termin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TerminFindUniqueOrThrowArgs>(args: SelectSubset<T, TerminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TerminClient<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Termin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TerminFindFirstArgs} args - Arguments to find a Termin
     * @example
     * // Get one Termin
     * const termin = await prisma.termin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TerminFindFirstArgs>(args?: SelectSubset<T, TerminFindFirstArgs<ExtArgs>>): Prisma__TerminClient<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Termin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TerminFindFirstOrThrowArgs} args - Arguments to find a Termin
     * @example
     * // Get one Termin
     * const termin = await prisma.termin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TerminFindFirstOrThrowArgs>(args?: SelectSubset<T, TerminFindFirstOrThrowArgs<ExtArgs>>): Prisma__TerminClient<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Termins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TerminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Termins
     * const termins = await prisma.termin.findMany()
     * 
     * // Get first 10 Termins
     * const termins = await prisma.termin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const terminWithIdOnly = await prisma.termin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TerminFindManyArgs>(args?: SelectSubset<T, TerminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Termin.
     * @param {TerminCreateArgs} args - Arguments to create a Termin.
     * @example
     * // Create one Termin
     * const Termin = await prisma.termin.create({
     *   data: {
     *     // ... data to create a Termin
     *   }
     * })
     * 
     */
    create<T extends TerminCreateArgs>(args: SelectSubset<T, TerminCreateArgs<ExtArgs>>): Prisma__TerminClient<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Termins.
     * @param {TerminCreateManyArgs} args - Arguments to create many Termins.
     * @example
     * // Create many Termins
     * const termin = await prisma.termin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TerminCreateManyArgs>(args?: SelectSubset<T, TerminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Termins and returns the data saved in the database.
     * @param {TerminCreateManyAndReturnArgs} args - Arguments to create many Termins.
     * @example
     * // Create many Termins
     * const termin = await prisma.termin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Termins and only return the `id`
     * const terminWithIdOnly = await prisma.termin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TerminCreateManyAndReturnArgs>(args?: SelectSubset<T, TerminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Termin.
     * @param {TerminDeleteArgs} args - Arguments to delete one Termin.
     * @example
     * // Delete one Termin
     * const Termin = await prisma.termin.delete({
     *   where: {
     *     // ... filter to delete one Termin
     *   }
     * })
     * 
     */
    delete<T extends TerminDeleteArgs>(args: SelectSubset<T, TerminDeleteArgs<ExtArgs>>): Prisma__TerminClient<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Termin.
     * @param {TerminUpdateArgs} args - Arguments to update one Termin.
     * @example
     * // Update one Termin
     * const termin = await prisma.termin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TerminUpdateArgs>(args: SelectSubset<T, TerminUpdateArgs<ExtArgs>>): Prisma__TerminClient<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Termins.
     * @param {TerminDeleteManyArgs} args - Arguments to filter Termins to delete.
     * @example
     * // Delete a few Termins
     * const { count } = await prisma.termin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TerminDeleteManyArgs>(args?: SelectSubset<T, TerminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Termins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TerminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Termins
     * const termin = await prisma.termin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TerminUpdateManyArgs>(args: SelectSubset<T, TerminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Termins and returns the data updated in the database.
     * @param {TerminUpdateManyAndReturnArgs} args - Arguments to update many Termins.
     * @example
     * // Update many Termins
     * const termin = await prisma.termin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Termins and only return the `id`
     * const terminWithIdOnly = await prisma.termin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TerminUpdateManyAndReturnArgs>(args: SelectSubset<T, TerminUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Termin.
     * @param {TerminUpsertArgs} args - Arguments to update or create a Termin.
     * @example
     * // Update or create a Termin
     * const termin = await prisma.termin.upsert({
     *   create: {
     *     // ... data to create a Termin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Termin we want to update
     *   }
     * })
     */
    upsert<T extends TerminUpsertArgs>(args: SelectSubset<T, TerminUpsertArgs<ExtArgs>>): Prisma__TerminClient<$Result.GetResult<Prisma.$TerminPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Termins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TerminCountArgs} args - Arguments to filter Termins to count.
     * @example
     * // Count the number of Termins
     * const count = await prisma.termin.count({
     *   where: {
     *     // ... the filter for the Termins we want to count
     *   }
     * })
    **/
    count<T extends TerminCountArgs>(
      args?: Subset<T, TerminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TerminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Termin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TerminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TerminAggregateArgs>(args: Subset<T, TerminAggregateArgs>): Prisma.PrismaPromise<GetTerminAggregateType<T>>

    /**
     * Group by Termin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TerminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TerminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TerminGroupByArgs['orderBy'] }
        : { orderBy?: TerminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TerminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTerminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Termin model
   */
  readonly fields: TerminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Termin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TerminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Termin model
   */
  interface TerminFieldRefs {
    readonly id: FieldRef<"Termin", 'Int'>
    readonly doktorId: FieldRef<"Termin", 'Int'>
    readonly pacijentId: FieldRef<"Termin", 'Int'>
    readonly datum: FieldRef<"Termin", 'String'>
    readonly razlog: FieldRef<"Termin", 'String'>
    readonly createdAt: FieldRef<"Termin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Termin findUnique
   */
  export type TerminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * Filter, which Termin to fetch.
     */
    where: TerminWhereUniqueInput
  }

  /**
   * Termin findUniqueOrThrow
   */
  export type TerminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * Filter, which Termin to fetch.
     */
    where: TerminWhereUniqueInput
  }

  /**
   * Termin findFirst
   */
  export type TerminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * Filter, which Termin to fetch.
     */
    where?: TerminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Termins to fetch.
     */
    orderBy?: TerminOrderByWithRelationInput | TerminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Termins.
     */
    cursor?: TerminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Termins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Termins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Termins.
     */
    distinct?: TerminScalarFieldEnum | TerminScalarFieldEnum[]
  }

  /**
   * Termin findFirstOrThrow
   */
  export type TerminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * Filter, which Termin to fetch.
     */
    where?: TerminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Termins to fetch.
     */
    orderBy?: TerminOrderByWithRelationInput | TerminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Termins.
     */
    cursor?: TerminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Termins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Termins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Termins.
     */
    distinct?: TerminScalarFieldEnum | TerminScalarFieldEnum[]
  }

  /**
   * Termin findMany
   */
  export type TerminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * Filter, which Termins to fetch.
     */
    where?: TerminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Termins to fetch.
     */
    orderBy?: TerminOrderByWithRelationInput | TerminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Termins.
     */
    cursor?: TerminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Termins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Termins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Termins.
     */
    distinct?: TerminScalarFieldEnum | TerminScalarFieldEnum[]
  }

  /**
   * Termin create
   */
  export type TerminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * The data needed to create a Termin.
     */
    data: XOR<TerminCreateInput, TerminUncheckedCreateInput>
  }

  /**
   * Termin createMany
   */
  export type TerminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Termins.
     */
    data: TerminCreateManyInput | TerminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Termin createManyAndReturn
   */
  export type TerminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * The data used to create many Termins.
     */
    data: TerminCreateManyInput | TerminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Termin update
   */
  export type TerminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * The data needed to update a Termin.
     */
    data: XOR<TerminUpdateInput, TerminUncheckedUpdateInput>
    /**
     * Choose, which Termin to update.
     */
    where: TerminWhereUniqueInput
  }

  /**
   * Termin updateMany
   */
  export type TerminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Termins.
     */
    data: XOR<TerminUpdateManyMutationInput, TerminUncheckedUpdateManyInput>
    /**
     * Filter which Termins to update
     */
    where?: TerminWhereInput
    /**
     * Limit how many Termins to update.
     */
    limit?: number
  }

  /**
   * Termin updateManyAndReturn
   */
  export type TerminUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * The data used to update Termins.
     */
    data: XOR<TerminUpdateManyMutationInput, TerminUncheckedUpdateManyInput>
    /**
     * Filter which Termins to update
     */
    where?: TerminWhereInput
    /**
     * Limit how many Termins to update.
     */
    limit?: number
  }

  /**
   * Termin upsert
   */
  export type TerminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * The filter to search for the Termin to update in case it exists.
     */
    where: TerminWhereUniqueInput
    /**
     * In case the Termin found by the `where` argument doesn't exist, create a new Termin with this data.
     */
    create: XOR<TerminCreateInput, TerminUncheckedCreateInput>
    /**
     * In case the Termin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TerminUpdateInput, TerminUncheckedUpdateInput>
  }

  /**
   * Termin delete
   */
  export type TerminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
    /**
     * Filter which Termin to delete.
     */
    where: TerminWhereUniqueInput
  }

  /**
   * Termin deleteMany
   */
  export type TerminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Termins to delete
     */
    where?: TerminWhereInput
    /**
     * Limit how many Termins to delete.
     */
    limit?: number
  }

  /**
   * Termin without action
   */
  export type TerminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Termin
     */
    select?: TerminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Termin
     */
    omit?: TerminOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SessionScalarFieldEnum: {
    id: 'id',
    tokenId: 'tokenId',
    sessionKey: 'sessionKey',
    cookieId: 'cookieId',
    identMethod: 'identMethod',
    firstSeen: 'firstSeen',
    lastSeen: 'lastSeen',
    lastAnalyzedAt: 'lastAnalyzedAt',
    sourceIp: 'sourceIp',
    userAgent: 'userAgent'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    timestamp: 'timestamp',
    eventType: 'eventType',
    method: 'method',
    endpoint: 'endpoint',
    statusCode: 'statusCode',
    durationMs: 'durationMs',
    queryParams: 'queryParams',
    body: 'body',
    headers: 'headers',
    contentType: 'contentType',
    referer: 'referer',
    origin: 'origin',
    analyzedAt: 'analyzedAt',
    analyzeCount: 'analyzeCount',
    metadata: 'metadata'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const ClassificationScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    createdAt: 'createdAt',
    detector: 'detector',
    category: 'category',
    confidence: 'confidence',
    severity: 'severity',
    explanation: 'explanation'
  };

  export type ClassificationScalarFieldEnum = (typeof ClassificationScalarFieldEnum)[keyof typeof ClassificationScalarFieldEnum]


  export const PatientScalarFieldEnum: {
    id: 'id',
    name: 'name',
    surname: 'surname',
    jmbg: 'jmbg',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    phoneNumber: 'phoneNumber',
    address: 'address',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const DoktorScalarFieldEnum: {
    id: 'id',
    ime: 'ime',
    prezime: 'prezime',
    odjel: 'odjel',
    ukupno: 'ukupno',
    brojZakazanih: 'brojZakazanih',
    brojSlobodnih: 'brojSlobodnih'
  };

  export type DoktorScalarFieldEnum = (typeof DoktorScalarFieldEnum)[keyof typeof DoktorScalarFieldEnum]


  export const UlogaScalarFieldEnum: {
    id: 'id',
    uloga: 'uloga',
    broj: 'broj'
  };

  export type UlogaScalarFieldEnum = (typeof UlogaScalarFieldEnum)[keyof typeof UlogaScalarFieldEnum]


  export const TerminScalarFieldEnum: {
    id: 'id',
    doktorId: 'doktorId',
    pacijentId: 'pacijentId',
    datum: 'datum',
    razlog: 'razlog',
    createdAt: 'createdAt'
  };

  export type TerminScalarFieldEnum = (typeof TerminScalarFieldEnum)[keyof typeof TerminScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    tokenId?: StringFilter<"Session"> | string
    sessionKey?: StringFilter<"Session"> | string
    cookieId?: StringFilter<"Session"> | string
    identMethod?: StringFilter<"Session"> | string
    firstSeen?: DateTimeFilter<"Session"> | Date | string
    lastSeen?: DateTimeFilter<"Session"> | Date | string
    lastAnalyzedAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    sourceIp?: StringFilter<"Session"> | string
    userAgent?: StringFilter<"Session"> | string
    events?: EventListRelationFilter
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    tokenId?: SortOrder
    sessionKey?: SortOrder
    cookieId?: SortOrder
    identMethod?: SortOrder
    firstSeen?: SortOrder
    lastSeen?: SortOrder
    lastAnalyzedAt?: SortOrderInput | SortOrder
    sourceIp?: SortOrder
    userAgent?: SortOrder
    events?: EventOrderByRelationAggregateInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionKey?: string
    cookieId?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    tokenId?: StringFilter<"Session"> | string
    identMethod?: StringFilter<"Session"> | string
    firstSeen?: DateTimeFilter<"Session"> | Date | string
    lastSeen?: DateTimeFilter<"Session"> | Date | string
    lastAnalyzedAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    sourceIp?: StringFilter<"Session"> | string
    userAgent?: StringFilter<"Session"> | string
    events?: EventListRelationFilter
  }, "id" | "sessionKey" | "cookieId">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    tokenId?: SortOrder
    sessionKey?: SortOrder
    cookieId?: SortOrder
    identMethod?: SortOrder
    firstSeen?: SortOrder
    lastSeen?: SortOrder
    lastAnalyzedAt?: SortOrderInput | SortOrder
    sourceIp?: SortOrder
    userAgent?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    tokenId?: StringWithAggregatesFilter<"Session"> | string
    sessionKey?: StringWithAggregatesFilter<"Session"> | string
    cookieId?: StringWithAggregatesFilter<"Session"> | string
    identMethod?: StringWithAggregatesFilter<"Session"> | string
    firstSeen?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    lastSeen?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    lastAnalyzedAt?: DateTimeNullableWithAggregatesFilter<"Session"> | Date | string | null
    sourceIp?: StringWithAggregatesFilter<"Session"> | string
    userAgent?: StringWithAggregatesFilter<"Session"> | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: StringFilter<"Event"> | string
    sessionId?: StringFilter<"Event"> | string
    timestamp?: DateTimeFilter<"Event"> | Date | string
    eventType?: StringNullableFilter<"Event"> | string | null
    method?: StringFilter<"Event"> | string
    endpoint?: StringFilter<"Event"> | string
    statusCode?: IntNullableFilter<"Event"> | number | null
    durationMs?: IntNullableFilter<"Event"> | number | null
    queryParams?: JsonNullableFilter<"Event">
    body?: JsonNullableFilter<"Event">
    headers?: JsonNullableFilter<"Event">
    contentType?: StringNullableFilter<"Event"> | string | null
    referer?: StringNullableFilter<"Event"> | string | null
    origin?: StringNullableFilter<"Event"> | string | null
    analyzedAt?: DateTimeNullableFilter<"Event"> | Date | string | null
    analyzeCount?: IntFilter<"Event"> | number
    metadata?: JsonNullableFilter<"Event">
    session?: XOR<SessionScalarRelationFilter, SessionWhereInput>
    classification?: XOR<ClassificationNullableScalarRelationFilter, ClassificationWhereInput> | null
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    timestamp?: SortOrder
    eventType?: SortOrderInput | SortOrder
    method?: SortOrder
    endpoint?: SortOrder
    statusCode?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    queryParams?: SortOrderInput | SortOrder
    body?: SortOrderInput | SortOrder
    headers?: SortOrderInput | SortOrder
    contentType?: SortOrderInput | SortOrder
    referer?: SortOrderInput | SortOrder
    origin?: SortOrderInput | SortOrder
    analyzedAt?: SortOrderInput | SortOrder
    analyzeCount?: SortOrder
    metadata?: SortOrderInput | SortOrder
    session?: SessionOrderByWithRelationInput
    classification?: ClassificationOrderByWithRelationInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    sessionId?: StringFilter<"Event"> | string
    timestamp?: DateTimeFilter<"Event"> | Date | string
    eventType?: StringNullableFilter<"Event"> | string | null
    method?: StringFilter<"Event"> | string
    endpoint?: StringFilter<"Event"> | string
    statusCode?: IntNullableFilter<"Event"> | number | null
    durationMs?: IntNullableFilter<"Event"> | number | null
    queryParams?: JsonNullableFilter<"Event">
    body?: JsonNullableFilter<"Event">
    headers?: JsonNullableFilter<"Event">
    contentType?: StringNullableFilter<"Event"> | string | null
    referer?: StringNullableFilter<"Event"> | string | null
    origin?: StringNullableFilter<"Event"> | string | null
    analyzedAt?: DateTimeNullableFilter<"Event"> | Date | string | null
    analyzeCount?: IntFilter<"Event"> | number
    metadata?: JsonNullableFilter<"Event">
    session?: XOR<SessionScalarRelationFilter, SessionWhereInput>
    classification?: XOR<ClassificationNullableScalarRelationFilter, ClassificationWhereInput> | null
  }, "id">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    timestamp?: SortOrder
    eventType?: SortOrderInput | SortOrder
    method?: SortOrder
    endpoint?: SortOrder
    statusCode?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    queryParams?: SortOrderInput | SortOrder
    body?: SortOrderInput | SortOrder
    headers?: SortOrderInput | SortOrder
    contentType?: SortOrderInput | SortOrder
    referer?: SortOrderInput | SortOrder
    origin?: SortOrderInput | SortOrder
    analyzedAt?: SortOrderInput | SortOrder
    analyzeCount?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Event"> | string
    sessionId?: StringWithAggregatesFilter<"Event"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    eventType?: StringNullableWithAggregatesFilter<"Event"> | string | null
    method?: StringWithAggregatesFilter<"Event"> | string
    endpoint?: StringWithAggregatesFilter<"Event"> | string
    statusCode?: IntNullableWithAggregatesFilter<"Event"> | number | null
    durationMs?: IntNullableWithAggregatesFilter<"Event"> | number | null
    queryParams?: JsonNullableWithAggregatesFilter<"Event">
    body?: JsonNullableWithAggregatesFilter<"Event">
    headers?: JsonNullableWithAggregatesFilter<"Event">
    contentType?: StringNullableWithAggregatesFilter<"Event"> | string | null
    referer?: StringNullableWithAggregatesFilter<"Event"> | string | null
    origin?: StringNullableWithAggregatesFilter<"Event"> | string | null
    analyzedAt?: DateTimeNullableWithAggregatesFilter<"Event"> | Date | string | null
    analyzeCount?: IntWithAggregatesFilter<"Event"> | number
    metadata?: JsonNullableWithAggregatesFilter<"Event">
  }

  export type ClassificationWhereInput = {
    AND?: ClassificationWhereInput | ClassificationWhereInput[]
    OR?: ClassificationWhereInput[]
    NOT?: ClassificationWhereInput | ClassificationWhereInput[]
    id?: StringFilter<"Classification"> | string
    eventId?: StringFilter<"Classification"> | string
    createdAt?: DateTimeFilter<"Classification"> | Date | string
    detector?: StringFilter<"Classification"> | string
    category?: StringFilter<"Classification"> | string
    confidence?: FloatFilter<"Classification"> | number
    severity?: StringNullableFilter<"Classification"> | string | null
    explanation?: StringNullableFilter<"Classification"> | string | null
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
  }

  export type ClassificationOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    detector?: SortOrder
    category?: SortOrder
    confidence?: SortOrder
    severity?: SortOrderInput | SortOrder
    explanation?: SortOrderInput | SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type ClassificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId?: string
    AND?: ClassificationWhereInput | ClassificationWhereInput[]
    OR?: ClassificationWhereInput[]
    NOT?: ClassificationWhereInput | ClassificationWhereInput[]
    createdAt?: DateTimeFilter<"Classification"> | Date | string
    detector?: StringFilter<"Classification"> | string
    category?: StringFilter<"Classification"> | string
    confidence?: FloatFilter<"Classification"> | number
    severity?: StringNullableFilter<"Classification"> | string | null
    explanation?: StringNullableFilter<"Classification"> | string | null
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
  }, "id" | "eventId">

  export type ClassificationOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    detector?: SortOrder
    category?: SortOrder
    confidence?: SortOrder
    severity?: SortOrderInput | SortOrder
    explanation?: SortOrderInput | SortOrder
    _count?: ClassificationCountOrderByAggregateInput
    _avg?: ClassificationAvgOrderByAggregateInput
    _max?: ClassificationMaxOrderByAggregateInput
    _min?: ClassificationMinOrderByAggregateInput
    _sum?: ClassificationSumOrderByAggregateInput
  }

  export type ClassificationScalarWhereWithAggregatesInput = {
    AND?: ClassificationScalarWhereWithAggregatesInput | ClassificationScalarWhereWithAggregatesInput[]
    OR?: ClassificationScalarWhereWithAggregatesInput[]
    NOT?: ClassificationScalarWhereWithAggregatesInput | ClassificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Classification"> | string
    eventId?: StringWithAggregatesFilter<"Classification"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Classification"> | Date | string
    detector?: StringWithAggregatesFilter<"Classification"> | string
    category?: StringWithAggregatesFilter<"Classification"> | string
    confidence?: FloatWithAggregatesFilter<"Classification"> | number
    severity?: StringNullableWithAggregatesFilter<"Classification"> | string | null
    explanation?: StringNullableWithAggregatesFilter<"Classification"> | string | null
  }

  export type PatientWhereInput = {
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    id?: StringFilter<"Patient"> | string
    name?: StringFilter<"Patient"> | string
    surname?: StringFilter<"Patient"> | string
    jmbg?: StringFilter<"Patient"> | string
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    gender?: StringFilter<"Patient"> | string
    phoneNumber?: StringFilter<"Patient"> | string
    address?: StringFilter<"Patient"> | string
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    jmbg?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    jmbg?: string
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    name?: StringFilter<"Patient"> | string
    surname?: StringFilter<"Patient"> | string
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    gender?: StringFilter<"Patient"> | string
    phoneNumber?: StringFilter<"Patient"> | string
    address?: StringFilter<"Patient"> | string
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
  }, "id" | "jmbg">

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    jmbg?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientCountOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    OR?: PatientScalarWhereWithAggregatesInput[]
    NOT?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Patient"> | string
    name?: StringWithAggregatesFilter<"Patient"> | string
    surname?: StringWithAggregatesFilter<"Patient"> | string
    jmbg?: StringWithAggregatesFilter<"Patient"> | string
    dateOfBirth?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    gender?: StringWithAggregatesFilter<"Patient"> | string
    phoneNumber?: StringWithAggregatesFilter<"Patient"> | string
    address?: StringWithAggregatesFilter<"Patient"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
  }

  export type DoktorWhereInput = {
    AND?: DoktorWhereInput | DoktorWhereInput[]
    OR?: DoktorWhereInput[]
    NOT?: DoktorWhereInput | DoktorWhereInput[]
    id?: IntFilter<"Doktor"> | number
    ime?: StringFilter<"Doktor"> | string
    prezime?: StringFilter<"Doktor"> | string
    odjel?: StringFilter<"Doktor"> | string
    ukupno?: IntFilter<"Doktor"> | number
    brojZakazanih?: IntFilter<"Doktor"> | number
    brojSlobodnih?: IntFilter<"Doktor"> | number
  }

  export type DoktorOrderByWithRelationInput = {
    id?: SortOrder
    ime?: SortOrder
    prezime?: SortOrder
    odjel?: SortOrder
    ukupno?: SortOrder
    brojZakazanih?: SortOrder
    brojSlobodnih?: SortOrder
  }

  export type DoktorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DoktorWhereInput | DoktorWhereInput[]
    OR?: DoktorWhereInput[]
    NOT?: DoktorWhereInput | DoktorWhereInput[]
    ime?: StringFilter<"Doktor"> | string
    prezime?: StringFilter<"Doktor"> | string
    odjel?: StringFilter<"Doktor"> | string
    ukupno?: IntFilter<"Doktor"> | number
    brojZakazanih?: IntFilter<"Doktor"> | number
    brojSlobodnih?: IntFilter<"Doktor"> | number
  }, "id">

  export type DoktorOrderByWithAggregationInput = {
    id?: SortOrder
    ime?: SortOrder
    prezime?: SortOrder
    odjel?: SortOrder
    ukupno?: SortOrder
    brojZakazanih?: SortOrder
    brojSlobodnih?: SortOrder
    _count?: DoktorCountOrderByAggregateInput
    _avg?: DoktorAvgOrderByAggregateInput
    _max?: DoktorMaxOrderByAggregateInput
    _min?: DoktorMinOrderByAggregateInput
    _sum?: DoktorSumOrderByAggregateInput
  }

  export type DoktorScalarWhereWithAggregatesInput = {
    AND?: DoktorScalarWhereWithAggregatesInput | DoktorScalarWhereWithAggregatesInput[]
    OR?: DoktorScalarWhereWithAggregatesInput[]
    NOT?: DoktorScalarWhereWithAggregatesInput | DoktorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Doktor"> | number
    ime?: StringWithAggregatesFilter<"Doktor"> | string
    prezime?: StringWithAggregatesFilter<"Doktor"> | string
    odjel?: StringWithAggregatesFilter<"Doktor"> | string
    ukupno?: IntWithAggregatesFilter<"Doktor"> | number
    brojZakazanih?: IntWithAggregatesFilter<"Doktor"> | number
    brojSlobodnih?: IntWithAggregatesFilter<"Doktor"> | number
  }

  export type UlogaWhereInput = {
    AND?: UlogaWhereInput | UlogaWhereInput[]
    OR?: UlogaWhereInput[]
    NOT?: UlogaWhereInput | UlogaWhereInput[]
    id?: IntFilter<"Uloga"> | number
    uloga?: StringFilter<"Uloga"> | string
    broj?: IntFilter<"Uloga"> | number
  }

  export type UlogaOrderByWithRelationInput = {
    id?: SortOrder
    uloga?: SortOrder
    broj?: SortOrder
  }

  export type UlogaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uloga?: string
    AND?: UlogaWhereInput | UlogaWhereInput[]
    OR?: UlogaWhereInput[]
    NOT?: UlogaWhereInput | UlogaWhereInput[]
    broj?: IntFilter<"Uloga"> | number
  }, "id" | "uloga">

  export type UlogaOrderByWithAggregationInput = {
    id?: SortOrder
    uloga?: SortOrder
    broj?: SortOrder
    _count?: UlogaCountOrderByAggregateInput
    _avg?: UlogaAvgOrderByAggregateInput
    _max?: UlogaMaxOrderByAggregateInput
    _min?: UlogaMinOrderByAggregateInput
    _sum?: UlogaSumOrderByAggregateInput
  }

  export type UlogaScalarWhereWithAggregatesInput = {
    AND?: UlogaScalarWhereWithAggregatesInput | UlogaScalarWhereWithAggregatesInput[]
    OR?: UlogaScalarWhereWithAggregatesInput[]
    NOT?: UlogaScalarWhereWithAggregatesInput | UlogaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Uloga"> | number
    uloga?: StringWithAggregatesFilter<"Uloga"> | string
    broj?: IntWithAggregatesFilter<"Uloga"> | number
  }

  export type TerminWhereInput = {
    AND?: TerminWhereInput | TerminWhereInput[]
    OR?: TerminWhereInput[]
    NOT?: TerminWhereInput | TerminWhereInput[]
    id?: IntFilter<"Termin"> | number
    doktorId?: IntFilter<"Termin"> | number
    pacijentId?: IntNullableFilter<"Termin"> | number | null
    datum?: StringFilter<"Termin"> | string
    razlog?: StringNullableFilter<"Termin"> | string | null
    createdAt?: DateTimeFilter<"Termin"> | Date | string
  }

  export type TerminOrderByWithRelationInput = {
    id?: SortOrder
    doktorId?: SortOrder
    pacijentId?: SortOrderInput | SortOrder
    datum?: SortOrder
    razlog?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type TerminWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TerminWhereInput | TerminWhereInput[]
    OR?: TerminWhereInput[]
    NOT?: TerminWhereInput | TerminWhereInput[]
    doktorId?: IntFilter<"Termin"> | number
    pacijentId?: IntNullableFilter<"Termin"> | number | null
    datum?: StringFilter<"Termin"> | string
    razlog?: StringNullableFilter<"Termin"> | string | null
    createdAt?: DateTimeFilter<"Termin"> | Date | string
  }, "id">

  export type TerminOrderByWithAggregationInput = {
    id?: SortOrder
    doktorId?: SortOrder
    pacijentId?: SortOrderInput | SortOrder
    datum?: SortOrder
    razlog?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TerminCountOrderByAggregateInput
    _avg?: TerminAvgOrderByAggregateInput
    _max?: TerminMaxOrderByAggregateInput
    _min?: TerminMinOrderByAggregateInput
    _sum?: TerminSumOrderByAggregateInput
  }

  export type TerminScalarWhereWithAggregatesInput = {
    AND?: TerminScalarWhereWithAggregatesInput | TerminScalarWhereWithAggregatesInput[]
    OR?: TerminScalarWhereWithAggregatesInput[]
    NOT?: TerminScalarWhereWithAggregatesInput | TerminScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Termin"> | number
    doktorId?: IntWithAggregatesFilter<"Termin"> | number
    pacijentId?: IntNullableWithAggregatesFilter<"Termin"> | number | null
    datum?: StringWithAggregatesFilter<"Termin"> | string
    razlog?: StringNullableWithAggregatesFilter<"Termin"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Termin"> | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    tokenId: string
    sessionKey: string
    cookieId: string
    identMethod?: string
    firstSeen?: Date | string
    lastSeen?: Date | string
    lastAnalyzedAt?: Date | string | null
    sourceIp: string
    userAgent: string
    events?: EventCreateNestedManyWithoutSessionInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    tokenId: string
    sessionKey: string
    cookieId: string
    identMethod?: string
    firstSeen?: Date | string
    lastSeen?: Date | string
    lastAnalyzedAt?: Date | string | null
    sourceIp: string
    userAgent: string
    events?: EventUncheckedCreateNestedManyWithoutSessionInput
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    sessionKey?: StringFieldUpdateOperationsInput | string
    cookieId?: StringFieldUpdateOperationsInput | string
    identMethod?: StringFieldUpdateOperationsInput | string
    firstSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastAnalyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceIp?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
    events?: EventUpdateManyWithoutSessionNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    sessionKey?: StringFieldUpdateOperationsInput | string
    cookieId?: StringFieldUpdateOperationsInput | string
    identMethod?: StringFieldUpdateOperationsInput | string
    firstSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastAnalyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceIp?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
    events?: EventUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type SessionCreateManyInput = {
    id?: string
    tokenId: string
    sessionKey: string
    cookieId: string
    identMethod?: string
    firstSeen?: Date | string
    lastSeen?: Date | string
    lastAnalyzedAt?: Date | string | null
    sourceIp: string
    userAgent: string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    sessionKey?: StringFieldUpdateOperationsInput | string
    cookieId?: StringFieldUpdateOperationsInput | string
    identMethod?: StringFieldUpdateOperationsInput | string
    firstSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastAnalyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceIp?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    sessionKey?: StringFieldUpdateOperationsInput | string
    cookieId?: StringFieldUpdateOperationsInput | string
    identMethod?: StringFieldUpdateOperationsInput | string
    firstSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastAnalyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceIp?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
  }

  export type EventCreateInput = {
    id?: string
    timestamp?: Date | string
    eventType?: string | null
    method: string
    endpoint: string
    statusCode?: number | null
    durationMs?: number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: string | null
    referer?: string | null
    origin?: string | null
    analyzedAt?: Date | string | null
    analyzeCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    session: SessionCreateNestedOneWithoutEventsInput
    classification?: ClassificationCreateNestedOneWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    sessionId: string
    timestamp?: Date | string
    eventType?: string | null
    method: string
    endpoint: string
    statusCode?: number | null
    durationMs?: number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: string | null
    referer?: string | null
    origin?: string | null
    analyzedAt?: Date | string | null
    analyzeCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    classification?: ClassificationUncheckedCreateNestedOneWithoutEventInput
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    method?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    analyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyzeCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    session?: SessionUpdateOneRequiredWithoutEventsNestedInput
    classification?: ClassificationUpdateOneWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    method?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    analyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyzeCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    classification?: ClassificationUncheckedUpdateOneWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: string
    sessionId: string
    timestamp?: Date | string
    eventType?: string | null
    method: string
    endpoint: string
    statusCode?: number | null
    durationMs?: number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: string | null
    referer?: string | null
    origin?: string | null
    analyzedAt?: Date | string | null
    analyzeCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    method?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    analyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyzeCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    method?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    analyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyzeCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClassificationCreateInput = {
    id?: string
    createdAt?: Date | string
    detector: string
    category: string
    confidence: number
    severity?: string | null
    explanation?: string | null
    event: EventCreateNestedOneWithoutClassificationInput
  }

  export type ClassificationUncheckedCreateInput = {
    id?: string
    eventId: string
    createdAt?: Date | string
    detector: string
    category: string
    confidence: number
    severity?: string | null
    explanation?: string | null
  }

  export type ClassificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detector?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    event?: EventUpdateOneRequiredWithoutClassificationNestedInput
  }

  export type ClassificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detector?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClassificationCreateManyInput = {
    id?: string
    eventId: string
    createdAt?: Date | string
    detector: string
    category: string
    confidence: number
    severity?: string | null
    explanation?: string | null
  }

  export type ClassificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detector?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClassificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detector?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientCreateInput = {
    id?: string
    name: string
    surname: string
    jmbg: string
    dateOfBirth: Date | string
    gender: string
    phoneNumber: string
    address: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUncheckedCreateInput = {
    id?: string
    name: string
    surname: string
    jmbg: string
    dateOfBirth: Date | string
    gender: string
    phoneNumber: string
    address: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    surname?: StringFieldUpdateOperationsInput | string
    jmbg?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    surname?: StringFieldUpdateOperationsInput | string
    jmbg?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientCreateManyInput = {
    id?: string
    name: string
    surname: string
    jmbg: string
    dateOfBirth: Date | string
    gender: string
    phoneNumber: string
    address: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    surname?: StringFieldUpdateOperationsInput | string
    jmbg?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    surname?: StringFieldUpdateOperationsInput | string
    jmbg?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DoktorCreateInput = {
    ime: string
    prezime: string
    odjel: string
    ukupno: number
    brojZakazanih: number
    brojSlobodnih: number
  }

  export type DoktorUncheckedCreateInput = {
    id?: number
    ime: string
    prezime: string
    odjel: string
    ukupno: number
    brojZakazanih: number
    brojSlobodnih: number
  }

  export type DoktorUpdateInput = {
    ime?: StringFieldUpdateOperationsInput | string
    prezime?: StringFieldUpdateOperationsInput | string
    odjel?: StringFieldUpdateOperationsInput | string
    ukupno?: IntFieldUpdateOperationsInput | number
    brojZakazanih?: IntFieldUpdateOperationsInput | number
    brojSlobodnih?: IntFieldUpdateOperationsInput | number
  }

  export type DoktorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ime?: StringFieldUpdateOperationsInput | string
    prezime?: StringFieldUpdateOperationsInput | string
    odjel?: StringFieldUpdateOperationsInput | string
    ukupno?: IntFieldUpdateOperationsInput | number
    brojZakazanih?: IntFieldUpdateOperationsInput | number
    brojSlobodnih?: IntFieldUpdateOperationsInput | number
  }

  export type DoktorCreateManyInput = {
    id?: number
    ime: string
    prezime: string
    odjel: string
    ukupno: number
    brojZakazanih: number
    brojSlobodnih: number
  }

  export type DoktorUpdateManyMutationInput = {
    ime?: StringFieldUpdateOperationsInput | string
    prezime?: StringFieldUpdateOperationsInput | string
    odjel?: StringFieldUpdateOperationsInput | string
    ukupno?: IntFieldUpdateOperationsInput | number
    brojZakazanih?: IntFieldUpdateOperationsInput | number
    brojSlobodnih?: IntFieldUpdateOperationsInput | number
  }

  export type DoktorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ime?: StringFieldUpdateOperationsInput | string
    prezime?: StringFieldUpdateOperationsInput | string
    odjel?: StringFieldUpdateOperationsInput | string
    ukupno?: IntFieldUpdateOperationsInput | number
    brojZakazanih?: IntFieldUpdateOperationsInput | number
    brojSlobodnih?: IntFieldUpdateOperationsInput | number
  }

  export type UlogaCreateInput = {
    uloga: string
    broj: number
  }

  export type UlogaUncheckedCreateInput = {
    id?: number
    uloga: string
    broj: number
  }

  export type UlogaUpdateInput = {
    uloga?: StringFieldUpdateOperationsInput | string
    broj?: IntFieldUpdateOperationsInput | number
  }

  export type UlogaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uloga?: StringFieldUpdateOperationsInput | string
    broj?: IntFieldUpdateOperationsInput | number
  }

  export type UlogaCreateManyInput = {
    id?: number
    uloga: string
    broj: number
  }

  export type UlogaUpdateManyMutationInput = {
    uloga?: StringFieldUpdateOperationsInput | string
    broj?: IntFieldUpdateOperationsInput | number
  }

  export type UlogaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uloga?: StringFieldUpdateOperationsInput | string
    broj?: IntFieldUpdateOperationsInput | number
  }

  export type TerminCreateInput = {
    doktorId: number
    pacijentId?: number | null
    datum: string
    razlog?: string | null
    createdAt?: Date | string
  }

  export type TerminUncheckedCreateInput = {
    id?: number
    doktorId: number
    pacijentId?: number | null
    datum: string
    razlog?: string | null
    createdAt?: Date | string
  }

  export type TerminUpdateInput = {
    doktorId?: IntFieldUpdateOperationsInput | number
    pacijentId?: NullableIntFieldUpdateOperationsInput | number | null
    datum?: StringFieldUpdateOperationsInput | string
    razlog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TerminUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    doktorId?: IntFieldUpdateOperationsInput | number
    pacijentId?: NullableIntFieldUpdateOperationsInput | number | null
    datum?: StringFieldUpdateOperationsInput | string
    razlog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TerminCreateManyInput = {
    id?: number
    doktorId: number
    pacijentId?: number | null
    datum: string
    razlog?: string | null
    createdAt?: Date | string
  }

  export type TerminUpdateManyMutationInput = {
    doktorId?: IntFieldUpdateOperationsInput | number
    pacijentId?: NullableIntFieldUpdateOperationsInput | number | null
    datum?: StringFieldUpdateOperationsInput | string
    razlog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TerminUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    doktorId?: IntFieldUpdateOperationsInput | number
    pacijentId?: NullableIntFieldUpdateOperationsInput | number | null
    datum?: StringFieldUpdateOperationsInput | string
    razlog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EventListRelationFilter = {
    every?: EventWhereInput
    some?: EventWhereInput
    none?: EventWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    tokenId?: SortOrder
    sessionKey?: SortOrder
    cookieId?: SortOrder
    identMethod?: SortOrder
    firstSeen?: SortOrder
    lastSeen?: SortOrder
    lastAnalyzedAt?: SortOrder
    sourceIp?: SortOrder
    userAgent?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    tokenId?: SortOrder
    sessionKey?: SortOrder
    cookieId?: SortOrder
    identMethod?: SortOrder
    firstSeen?: SortOrder
    lastSeen?: SortOrder
    lastAnalyzedAt?: SortOrder
    sourceIp?: SortOrder
    userAgent?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    tokenId?: SortOrder
    sessionKey?: SortOrder
    cookieId?: SortOrder
    identMethod?: SortOrder
    firstSeen?: SortOrder
    lastSeen?: SortOrder
    lastAnalyzedAt?: SortOrder
    sourceIp?: SortOrder
    userAgent?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SessionScalarRelationFilter = {
    is?: SessionWhereInput
    isNot?: SessionWhereInput
  }

  export type ClassificationNullableScalarRelationFilter = {
    is?: ClassificationWhereInput | null
    isNot?: ClassificationWhereInput | null
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    timestamp?: SortOrder
    eventType?: SortOrder
    method?: SortOrder
    endpoint?: SortOrder
    statusCode?: SortOrder
    durationMs?: SortOrder
    queryParams?: SortOrder
    body?: SortOrder
    headers?: SortOrder
    contentType?: SortOrder
    referer?: SortOrder
    origin?: SortOrder
    analyzedAt?: SortOrder
    analyzeCount?: SortOrder
    metadata?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    statusCode?: SortOrder
    durationMs?: SortOrder
    analyzeCount?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    timestamp?: SortOrder
    eventType?: SortOrder
    method?: SortOrder
    endpoint?: SortOrder
    statusCode?: SortOrder
    durationMs?: SortOrder
    contentType?: SortOrder
    referer?: SortOrder
    origin?: SortOrder
    analyzedAt?: SortOrder
    analyzeCount?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    timestamp?: SortOrder
    eventType?: SortOrder
    method?: SortOrder
    endpoint?: SortOrder
    statusCode?: SortOrder
    durationMs?: SortOrder
    contentType?: SortOrder
    referer?: SortOrder
    origin?: SortOrder
    analyzedAt?: SortOrder
    analyzeCount?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    statusCode?: SortOrder
    durationMs?: SortOrder
    analyzeCount?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EventScalarRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type ClassificationCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    detector?: SortOrder
    category?: SortOrder
    confidence?: SortOrder
    severity?: SortOrder
    explanation?: SortOrder
  }

  export type ClassificationAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type ClassificationMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    detector?: SortOrder
    category?: SortOrder
    confidence?: SortOrder
    severity?: SortOrder
    explanation?: SortOrder
  }

  export type ClassificationMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    detector?: SortOrder
    category?: SortOrder
    confidence?: SortOrder
    severity?: SortOrder
    explanation?: SortOrder
  }

  export type ClassificationSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    jmbg?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    jmbg?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    jmbg?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DoktorCountOrderByAggregateInput = {
    id?: SortOrder
    ime?: SortOrder
    prezime?: SortOrder
    odjel?: SortOrder
    ukupno?: SortOrder
    brojZakazanih?: SortOrder
    brojSlobodnih?: SortOrder
  }

  export type DoktorAvgOrderByAggregateInput = {
    id?: SortOrder
    ukupno?: SortOrder
    brojZakazanih?: SortOrder
    brojSlobodnih?: SortOrder
  }

  export type DoktorMaxOrderByAggregateInput = {
    id?: SortOrder
    ime?: SortOrder
    prezime?: SortOrder
    odjel?: SortOrder
    ukupno?: SortOrder
    brojZakazanih?: SortOrder
    brojSlobodnih?: SortOrder
  }

  export type DoktorMinOrderByAggregateInput = {
    id?: SortOrder
    ime?: SortOrder
    prezime?: SortOrder
    odjel?: SortOrder
    ukupno?: SortOrder
    brojZakazanih?: SortOrder
    brojSlobodnih?: SortOrder
  }

  export type DoktorSumOrderByAggregateInput = {
    id?: SortOrder
    ukupno?: SortOrder
    brojZakazanih?: SortOrder
    brojSlobodnih?: SortOrder
  }

  export type UlogaCountOrderByAggregateInput = {
    id?: SortOrder
    uloga?: SortOrder
    broj?: SortOrder
  }

  export type UlogaAvgOrderByAggregateInput = {
    id?: SortOrder
    broj?: SortOrder
  }

  export type UlogaMaxOrderByAggregateInput = {
    id?: SortOrder
    uloga?: SortOrder
    broj?: SortOrder
  }

  export type UlogaMinOrderByAggregateInput = {
    id?: SortOrder
    uloga?: SortOrder
    broj?: SortOrder
  }

  export type UlogaSumOrderByAggregateInput = {
    id?: SortOrder
    broj?: SortOrder
  }

  export type TerminCountOrderByAggregateInput = {
    id?: SortOrder
    doktorId?: SortOrder
    pacijentId?: SortOrder
    datum?: SortOrder
    razlog?: SortOrder
    createdAt?: SortOrder
  }

  export type TerminAvgOrderByAggregateInput = {
    id?: SortOrder
    doktorId?: SortOrder
    pacijentId?: SortOrder
  }

  export type TerminMaxOrderByAggregateInput = {
    id?: SortOrder
    doktorId?: SortOrder
    pacijentId?: SortOrder
    datum?: SortOrder
    razlog?: SortOrder
    createdAt?: SortOrder
  }

  export type TerminMinOrderByAggregateInput = {
    id?: SortOrder
    doktorId?: SortOrder
    pacijentId?: SortOrder
    datum?: SortOrder
    razlog?: SortOrder
    createdAt?: SortOrder
  }

  export type TerminSumOrderByAggregateInput = {
    id?: SortOrder
    doktorId?: SortOrder
    pacijentId?: SortOrder
  }

  export type EventCreateNestedManyWithoutSessionInput = {
    create?: XOR<EventCreateWithoutSessionInput, EventUncheckedCreateWithoutSessionInput> | EventCreateWithoutSessionInput[] | EventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: EventCreateOrConnectWithoutSessionInput | EventCreateOrConnectWithoutSessionInput[]
    createMany?: EventCreateManySessionInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type EventUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<EventCreateWithoutSessionInput, EventUncheckedCreateWithoutSessionInput> | EventCreateWithoutSessionInput[] | EventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: EventCreateOrConnectWithoutSessionInput | EventCreateOrConnectWithoutSessionInput[]
    createMany?: EventCreateManySessionInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EventUpdateManyWithoutSessionNestedInput = {
    create?: XOR<EventCreateWithoutSessionInput, EventUncheckedCreateWithoutSessionInput> | EventCreateWithoutSessionInput[] | EventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: EventCreateOrConnectWithoutSessionInput | EventCreateOrConnectWithoutSessionInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutSessionInput | EventUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: EventCreateManySessionInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutSessionInput | EventUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: EventUpdateManyWithWhereWithoutSessionInput | EventUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type EventUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<EventCreateWithoutSessionInput, EventUncheckedCreateWithoutSessionInput> | EventCreateWithoutSessionInput[] | EventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: EventCreateOrConnectWithoutSessionInput | EventCreateOrConnectWithoutSessionInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutSessionInput | EventUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: EventCreateManySessionInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutSessionInput | EventUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: EventUpdateManyWithWhereWithoutSessionInput | EventUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type SessionCreateNestedOneWithoutEventsInput = {
    create?: XOR<SessionCreateWithoutEventsInput, SessionUncheckedCreateWithoutEventsInput>
    connectOrCreate?: SessionCreateOrConnectWithoutEventsInput
    connect?: SessionWhereUniqueInput
  }

  export type ClassificationCreateNestedOneWithoutEventInput = {
    create?: XOR<ClassificationCreateWithoutEventInput, ClassificationUncheckedCreateWithoutEventInput>
    connectOrCreate?: ClassificationCreateOrConnectWithoutEventInput
    connect?: ClassificationWhereUniqueInput
  }

  export type ClassificationUncheckedCreateNestedOneWithoutEventInput = {
    create?: XOR<ClassificationCreateWithoutEventInput, ClassificationUncheckedCreateWithoutEventInput>
    connectOrCreate?: ClassificationCreateOrConnectWithoutEventInput
    connect?: ClassificationWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SessionUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<SessionCreateWithoutEventsInput, SessionUncheckedCreateWithoutEventsInput>
    connectOrCreate?: SessionCreateOrConnectWithoutEventsInput
    upsert?: SessionUpsertWithoutEventsInput
    connect?: SessionWhereUniqueInput
    update?: XOR<XOR<SessionUpdateToOneWithWhereWithoutEventsInput, SessionUpdateWithoutEventsInput>, SessionUncheckedUpdateWithoutEventsInput>
  }

  export type ClassificationUpdateOneWithoutEventNestedInput = {
    create?: XOR<ClassificationCreateWithoutEventInput, ClassificationUncheckedCreateWithoutEventInput>
    connectOrCreate?: ClassificationCreateOrConnectWithoutEventInput
    upsert?: ClassificationUpsertWithoutEventInput
    disconnect?: ClassificationWhereInput | boolean
    delete?: ClassificationWhereInput | boolean
    connect?: ClassificationWhereUniqueInput
    update?: XOR<XOR<ClassificationUpdateToOneWithWhereWithoutEventInput, ClassificationUpdateWithoutEventInput>, ClassificationUncheckedUpdateWithoutEventInput>
  }

  export type ClassificationUncheckedUpdateOneWithoutEventNestedInput = {
    create?: XOR<ClassificationCreateWithoutEventInput, ClassificationUncheckedCreateWithoutEventInput>
    connectOrCreate?: ClassificationCreateOrConnectWithoutEventInput
    upsert?: ClassificationUpsertWithoutEventInput
    disconnect?: ClassificationWhereInput | boolean
    delete?: ClassificationWhereInput | boolean
    connect?: ClassificationWhereUniqueInput
    update?: XOR<XOR<ClassificationUpdateToOneWithWhereWithoutEventInput, ClassificationUpdateWithoutEventInput>, ClassificationUncheckedUpdateWithoutEventInput>
  }

  export type EventCreateNestedOneWithoutClassificationInput = {
    create?: XOR<EventCreateWithoutClassificationInput, EventUncheckedCreateWithoutClassificationInput>
    connectOrCreate?: EventCreateOrConnectWithoutClassificationInput
    connect?: EventWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EventUpdateOneRequiredWithoutClassificationNestedInput = {
    create?: XOR<EventCreateWithoutClassificationInput, EventUncheckedCreateWithoutClassificationInput>
    connectOrCreate?: EventCreateOrConnectWithoutClassificationInput
    upsert?: EventUpsertWithoutClassificationInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutClassificationInput, EventUpdateWithoutClassificationInput>, EventUncheckedUpdateWithoutClassificationInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EventCreateWithoutSessionInput = {
    id?: string
    timestamp?: Date | string
    eventType?: string | null
    method: string
    endpoint: string
    statusCode?: number | null
    durationMs?: number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: string | null
    referer?: string | null
    origin?: string | null
    analyzedAt?: Date | string | null
    analyzeCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    classification?: ClassificationCreateNestedOneWithoutEventInput
  }

  export type EventUncheckedCreateWithoutSessionInput = {
    id?: string
    timestamp?: Date | string
    eventType?: string | null
    method: string
    endpoint: string
    statusCode?: number | null
    durationMs?: number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: string | null
    referer?: string | null
    origin?: string | null
    analyzedAt?: Date | string | null
    analyzeCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    classification?: ClassificationUncheckedCreateNestedOneWithoutEventInput
  }

  export type EventCreateOrConnectWithoutSessionInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutSessionInput, EventUncheckedCreateWithoutSessionInput>
  }

  export type EventCreateManySessionInputEnvelope = {
    data: EventCreateManySessionInput | EventCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type EventUpsertWithWhereUniqueWithoutSessionInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutSessionInput, EventUncheckedUpdateWithoutSessionInput>
    create: XOR<EventCreateWithoutSessionInput, EventUncheckedCreateWithoutSessionInput>
  }

  export type EventUpdateWithWhereUniqueWithoutSessionInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutSessionInput, EventUncheckedUpdateWithoutSessionInput>
  }

  export type EventUpdateManyWithWhereWithoutSessionInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutSessionInput>
  }

  export type EventScalarWhereInput = {
    AND?: EventScalarWhereInput | EventScalarWhereInput[]
    OR?: EventScalarWhereInput[]
    NOT?: EventScalarWhereInput | EventScalarWhereInput[]
    id?: StringFilter<"Event"> | string
    sessionId?: StringFilter<"Event"> | string
    timestamp?: DateTimeFilter<"Event"> | Date | string
    eventType?: StringNullableFilter<"Event"> | string | null
    method?: StringFilter<"Event"> | string
    endpoint?: StringFilter<"Event"> | string
    statusCode?: IntNullableFilter<"Event"> | number | null
    durationMs?: IntNullableFilter<"Event"> | number | null
    queryParams?: JsonNullableFilter<"Event">
    body?: JsonNullableFilter<"Event">
    headers?: JsonNullableFilter<"Event">
    contentType?: StringNullableFilter<"Event"> | string | null
    referer?: StringNullableFilter<"Event"> | string | null
    origin?: StringNullableFilter<"Event"> | string | null
    analyzedAt?: DateTimeNullableFilter<"Event"> | Date | string | null
    analyzeCount?: IntFilter<"Event"> | number
    metadata?: JsonNullableFilter<"Event">
  }

  export type SessionCreateWithoutEventsInput = {
    id?: string
    tokenId: string
    sessionKey: string
    cookieId: string
    identMethod?: string
    firstSeen?: Date | string
    lastSeen?: Date | string
    lastAnalyzedAt?: Date | string | null
    sourceIp: string
    userAgent: string
  }

  export type SessionUncheckedCreateWithoutEventsInput = {
    id?: string
    tokenId: string
    sessionKey: string
    cookieId: string
    identMethod?: string
    firstSeen?: Date | string
    lastSeen?: Date | string
    lastAnalyzedAt?: Date | string | null
    sourceIp: string
    userAgent: string
  }

  export type SessionCreateOrConnectWithoutEventsInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutEventsInput, SessionUncheckedCreateWithoutEventsInput>
  }

  export type ClassificationCreateWithoutEventInput = {
    id?: string
    createdAt?: Date | string
    detector: string
    category: string
    confidence: number
    severity?: string | null
    explanation?: string | null
  }

  export type ClassificationUncheckedCreateWithoutEventInput = {
    id?: string
    createdAt?: Date | string
    detector: string
    category: string
    confidence: number
    severity?: string | null
    explanation?: string | null
  }

  export type ClassificationCreateOrConnectWithoutEventInput = {
    where: ClassificationWhereUniqueInput
    create: XOR<ClassificationCreateWithoutEventInput, ClassificationUncheckedCreateWithoutEventInput>
  }

  export type SessionUpsertWithoutEventsInput = {
    update: XOR<SessionUpdateWithoutEventsInput, SessionUncheckedUpdateWithoutEventsInput>
    create: XOR<SessionCreateWithoutEventsInput, SessionUncheckedCreateWithoutEventsInput>
    where?: SessionWhereInput
  }

  export type SessionUpdateToOneWithWhereWithoutEventsInput = {
    where?: SessionWhereInput
    data: XOR<SessionUpdateWithoutEventsInput, SessionUncheckedUpdateWithoutEventsInput>
  }

  export type SessionUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    sessionKey?: StringFieldUpdateOperationsInput | string
    cookieId?: StringFieldUpdateOperationsInput | string
    identMethod?: StringFieldUpdateOperationsInput | string
    firstSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastAnalyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceIp?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
  }

  export type SessionUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    sessionKey?: StringFieldUpdateOperationsInput | string
    cookieId?: StringFieldUpdateOperationsInput | string
    identMethod?: StringFieldUpdateOperationsInput | string
    firstSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    lastAnalyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceIp?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
  }

  export type ClassificationUpsertWithoutEventInput = {
    update: XOR<ClassificationUpdateWithoutEventInput, ClassificationUncheckedUpdateWithoutEventInput>
    create: XOR<ClassificationCreateWithoutEventInput, ClassificationUncheckedCreateWithoutEventInput>
    where?: ClassificationWhereInput
  }

  export type ClassificationUpdateToOneWithWhereWithoutEventInput = {
    where?: ClassificationWhereInput
    data: XOR<ClassificationUpdateWithoutEventInput, ClassificationUncheckedUpdateWithoutEventInput>
  }

  export type ClassificationUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detector?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClassificationUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detector?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventCreateWithoutClassificationInput = {
    id?: string
    timestamp?: Date | string
    eventType?: string | null
    method: string
    endpoint: string
    statusCode?: number | null
    durationMs?: number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: string | null
    referer?: string | null
    origin?: string | null
    analyzedAt?: Date | string | null
    analyzeCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    session: SessionCreateNestedOneWithoutEventsInput
  }

  export type EventUncheckedCreateWithoutClassificationInput = {
    id?: string
    sessionId: string
    timestamp?: Date | string
    eventType?: string | null
    method: string
    endpoint: string
    statusCode?: number | null
    durationMs?: number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: string | null
    referer?: string | null
    origin?: string | null
    analyzedAt?: Date | string | null
    analyzeCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventCreateOrConnectWithoutClassificationInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutClassificationInput, EventUncheckedCreateWithoutClassificationInput>
  }

  export type EventUpsertWithoutClassificationInput = {
    update: XOR<EventUpdateWithoutClassificationInput, EventUncheckedUpdateWithoutClassificationInput>
    create: XOR<EventCreateWithoutClassificationInput, EventUncheckedCreateWithoutClassificationInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutClassificationInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutClassificationInput, EventUncheckedUpdateWithoutClassificationInput>
  }

  export type EventUpdateWithoutClassificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    method?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    analyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyzeCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    session?: SessionUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventUncheckedUpdateWithoutClassificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    method?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    analyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyzeCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventCreateManySessionInput = {
    id?: string
    timestamp?: Date | string
    eventType?: string | null
    method: string
    endpoint: string
    statusCode?: number | null
    durationMs?: number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: string | null
    referer?: string | null
    origin?: string | null
    analyzedAt?: Date | string | null
    analyzeCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    method?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    analyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyzeCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    classification?: ClassificationUpdateOneWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    method?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    analyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyzeCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    classification?: ClassificationUncheckedUpdateOneWithoutEventNestedInput
  }

  export type EventUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    method?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    queryParams?: NullableJsonNullValueInput | InputJsonValue
    body?: NullableJsonNullValueInput | InputJsonValue
    headers?: NullableJsonNullValueInput | InputJsonValue
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    analyzedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyzeCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}