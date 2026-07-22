// Builds a MongoDB connection URI for a specific database name, regardless
// of whether the base MONGO_URI in .env already has a trailing database
// name, a trailing slash, or query params (e.g. Atlas's
// "?retryWrites=true&w=majority"). This guards against malformed
// namespaces like "asvaa_school_portal/asvaa_master.schools" if someone's
// MONGO_URI still has an old database name baked into it.
export const buildMongoUri = (baseUri, dbName) => {
  const [withoutQuery, query] = baseUri.split("?");

  const protocolSplit = withoutQuery.indexOf("://");
  if (protocolSplit === -1) {
    throw new Error(`MONGO_URI is missing a protocol (mongodb:// or mongodb+srv://): ${baseUri}`);
  }

  const afterProtocol = withoutQuery.slice(protocolSplit + 3);
  const slashIndex = afterProtocol.indexOf("/");

  // hostPart = everything up to (but not including) any existing db name
  const hostPart =
    slashIndex === -1
      ? withoutQuery
      : withoutQuery.slice(0, protocolSplit + 3 + slashIndex);

  const cleanHostPart = hostPart.replace(/\/+$/, "");

  return query ? `${cleanHostPart}/${dbName}?${query}` : `${cleanHostPart}/${dbName}`;
};
