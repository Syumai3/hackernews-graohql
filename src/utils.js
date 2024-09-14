const jwt = require("jsonwebtoken");
APP_SECRET = "Graphql-is-aw3some";

// トークンを複合するための関数
function getTokenPayload(token) {
  // トークン化された前の情報(user.id)を複合する
  return jwt.verify(token, APP_SECRET);
}

//ユーザーIDを取得する関数
function getUserId(req, authToken) {
  if (req) {
    // ヘッダーを確認します。認証権限がありますか、という確認をする、
    const authHeader = req.headers.authorization;
    // 権限があるなら
    if (authHeader) {
      const taken = authHeader.replace("Bearer", "");
      if (!taken) {
        throw new Error("トークンが見つかりませんでした");
      }
      //  そのトークンを複合する
      const { userId } = getTokenPayload(taken);
      return userId;
    }
  } else if (authToken) {
    const { useId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("認証権限がありません");
}

module.exports = {
  APP_SECRET,
  getUserId,
};
