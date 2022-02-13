interface Query<TParams, TResult> {
  cypher: string;
  params: TParams;
  result: TResult;
}

function Query<TParams, TResult>(cypher: string, params: TParams, result: TResult): Query<TParams, TResult> {
  return { cypher, params, result };
}

export { Query };
