const { ApolloServer, gql } = require("apollo-server");
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const fs = require("fs");
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils.js");

const prisma = new PrismaClient();

//リゾルバ関係のファイルをインポート
const Query = require("./resolvers/Query.js");
const Mutation = require("./resolvers/Mutation.js");
const Link = require("./resolvers/Link.js");
const User = require("./resolvers/User.js");

// Resolvers　定義した雛形に対して、何かしらの実態のある値や処理を入れる。解決する
const resolvers = {
  Query,
  Mutation,
  Link,
  User,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  // prisamインスタンスをリゾルバー内で使用できるようにする
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      // biome-ignore lint/complexity/useOptionalChain: <explanation>
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
