import { z } from "zod";
import { InputMutation, InputQuery, Mutation, Query } from "./procedure";

export type KurreClientOptions = {
  url: string;
  credentials?: RequestCredentials;
};

export interface JsonRpcRequest extends BaseJsonRpcResponse {
  method: string;
  params: Array<Record<string, unknown>>;
}

export interface BaseJsonRpcResponse {
  jsonrpc: "2.0";
  id?: string | number | null;
}

export interface JsonRpcErrorResponse extends BaseJsonRpcResponse {
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface JsonRpcSuccessResponse extends BaseJsonRpcResponse {
  result: unknown;
}

export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

export function createKurreProxyClient<T>(options: KurreClientOptions) {
  async function sendRequest(
    method: string,
    args: Array<Record<string, unknown>>
  ) {
    try {
      const res: JsonRpcSuccessResponse = await fetcher(options, {
        jsonrpc: "2.0",
        id: 1,
        method,
        params: args,
      });

      return res.result;
    } catch (e) {
      console.log(e);
    }
  }

  return new Proxy(
    {},
    {
      get(prop) {
        return async (args: any) => {
          return sendRequest(prop.toString(), args);
        };
      },
    }
  );
}

export async function fetcher(
  options: KurreClientOptions,
  req: JsonRpcRequest
) {
  const res = await fetch(options.url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}
