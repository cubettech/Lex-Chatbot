import { LexRuntimeV2Client } from "@aws-sdk/client-lex-runtime-v2"; // ES Modules import
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

const lexClient = new LexRuntimeV2Client({
    region: "ap-southeast-1",
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: "ap-southeast-1" }),
      identityPoolId: "ap-southeast-1:357e7f7c-4579-4a52-9b99-a036111a687a",
    }),
});

export { lexClient };
