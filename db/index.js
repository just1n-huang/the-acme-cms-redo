const Sequelize = require("sequelize");
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_cms_db"
);

const Page = conn.define("page", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  name: {
    type: Sequelize.STRING,
  },
});

const Content = conn.define("content", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  name: {
    type: Sequelize.STRING,
  },
});

const Placement = conn.define("placement", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  rank: {
    type: Sequelize.INTEGER,
    defaultValue: 5,
  },
});

Page.belongsTo(Page, { as: "parent" });
// changes 'pageId' column name to parentId ***use DESCRIPTIVE names***
Page.hasMany(Page, { as: "children", foreignKey: "parentId" }); // be specific - use the existing parentId foreign key otherwise another foreign key will be created
Placement.belongsTo(Page);
Placement.belongsTo(Content);
Content.hasMany(Placement);

module.exports = {
  conn,
  Page,
  Content,
  Placement,
};
