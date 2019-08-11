export default class Option<T> {
  static some<T>(value: T): Option<T> {
    const some = Object.create(Option.prototype);
    some.isNone_ = false;
    some.value = value;
    return some;
  }

  static none<T>(): Option<T> {
    return NONE;
  }

  static all<T>(options: Option<T>[]): Option<T[]>;
  static all<A, B>(options: [Option<A>, Option<B>]): Option<[A, B]>;
  static all<A, B, C>(
    options: [Option<A>, Option<B>, Option<C>]
  ): Option<[A, B, C]>;
  static all<A, B, C, D>(
    options: [Option<A>, Option<B>, Option<C>, Option<D>]
  ): Option<[A, B, C, D]>;
  static all<A, B, C, D, E>(
    options: [Option<A>, Option<B>, Option<C>, Option<D>, Option<E>]
  ): Option<[A, B, C, D, E]>;
  static all<A, B, C, D, E, F>(
    options: [Option<A>, Option<B>, Option<C>, Option<D>, Option<E>, Option<F>]
  ): Option<[A, B, C, D, E, F]>;
  static all<A, B, C, D, E, F, G>(
    options: [
      Option<A>,
      Option<B>,
      Option<C>,
      Option<D>,
      Option<E>,
      Option<F>,
      Option<G>
    ]
  ): Option<[A, B, C, D, E, F, G]>;
  static all<A, B, C, D, E, F, G, H>(
    options: [
      Option<A>,
      Option<B>,
      Option<C>,
      Option<D>,
      Option<E>,
      Option<F>,
      Option<G>,
      Option<H>
    ]
  ): Option<[A, B, C, D, E, F, G, H]>;

  static all<T>(options: Option<T>[]): Option<T[]> {
    let values = [];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.isSome()) {
        values.push((option as any).value);
      } else {
        return Option.none();
      }
    }
    return Option.some(values);
  }

  match<N, S>(matcher: { none: () => N; some: (value: T) => S }): N | S {
    if (this.isNone()) {
      return matcher.none();
    } else {
      return matcher.some((this as any).value);
    }
  }

  isNone() {
    return (this as any).isNone_;
  }

  isSome() {
    return !this.isNone();
  }

  map<R>(mapper: (value: T) => R): Option<R> {
    return this.match({
      none: () => (this as unknown) as Option<R>,
      some: value => Option.some(mapper(value))
    });
  }

  ifSome(executor: (value: T) => void): void {
    this.map(executor);
  }

  unwrap(): T {
    return this.expect("Tried to call unwrap() on Option::None");
  }

  expect(message: string | Error): T {
    return this.match({
      none: () => {
        const error =
          "string" === typeof message ? new Error(message) : message;
        throw error;
      },
      some: value => value
    });
  }

  unwrapOr<D>(defaultValue: D): T | D {
    return this.match({
      none: () => defaultValue,
      some: value => value
    });
  }
}

const NONE = (() => {
  const none = Object.create(Option.prototype);
  none.isNone_ = true;
  return none;
})();
