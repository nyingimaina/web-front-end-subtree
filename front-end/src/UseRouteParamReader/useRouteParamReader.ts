import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useRouteParamReader(args: {
  paramName: string;
}): string | undefined {
  const router = useRouter();
  const [paramValue, setParamValue] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (router.isReady) {
      setParamValue(router.query[args.paramName] as string);
    }
  }, [router, args.paramName]);

  return paramValue;
}
