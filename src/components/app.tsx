import React,{Suspense} from "react";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { getConfig } from "utils/config";
import { Layout } from "./layout";
import { ConfigProvider } from "./config-provider";
import { CartPreview } from "pages/cart/preview";

const MyApp = () => {
  return (
<RecoilRoot>
      <ConfigProvider
        cssVariables={{
          "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
          "--zmp-background-color": "#f4f5f6",
        }}
      >
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <Suspense fallback={<div>Loading...</div>}>
                <Layout />
              </Suspense>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </ConfigProvider>
    </RecoilRoot>

  );
};
export default MyApp;
