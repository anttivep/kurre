import { AppRouter } from "./kurre";
import { createKurreProxyClient } from "./library/client";

export const client = createKurreProxyClient<AppRouter>({
  url: "/api/kurre/",
});
