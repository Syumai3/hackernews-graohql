const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../utils.js");
//ユーザーの新規登録のリゾルバ
async function signup(parent, args, context) {
  //パスワードの設定 (パスワードをハッシュ化)
  const password = await bcrypt.hash(args.password, 10);

  // ユーザーの新規作成
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  // JWTの生成（作成したユーザーをトークン化）
  const token = jwt.sign({ useId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// ユーザーのログインのリゾルバ
async function login(parent, args, context) {
  // ユーザーの検索
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  // ユーザーが存在しない場合
  if (!user) {
    throw new Error("そのようなユーザーは存在しません");
  }
  // パスワードを比較
  const vaild = await bcrypt.compare(args.password, user.password);

  // パスワードが一致しない場合
  if (!vaild) {
    throw new Error("無効なパスワードです");
  }

  // パスワードが一致した場合、JWTを生成
  const token = jwt.sign({ userId: user }, APP_SECRET);

  return {
    token,
    user,
  };
}

// ニュースを投稿するリゾルバ
async function post(parent, args, context) {
  const { userId } = context;
  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
}

module.exports = {
  signup,
  login,
  post,
};
