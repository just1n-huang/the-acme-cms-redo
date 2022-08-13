// cms - content management system
const express = require("express");
const app = express();
const { conn, Page, Content, Placement } = require("./db");

app.get("/api/pages", async (req, res, next) => {
  try {
    const pages = await Page.findAll({
      include: [
        {
          // this needs to be included the same way it was defined with the alias
          model: Page,
          as: "parent",
        },
      ],
    });
    res.send(pages);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/pages/:id", async (req, res, next) => {
  try {
    const pages = await Page.findByPk(req.params.id, {
      include: [
        {
          // this needs to be included the same way it was defined with the alias
          model: Page,
          as: "parent",
        },
        {
          // this needs to be included the same way it was defined with the alias
          model: Page,
          as: "children",
        },
      ],
    });
    res.send(pages);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/pages/:id/placements", async (req, res, next) => {
  try {
    const placements = await Placement.findAll({
      where: {
        pageId: req.params.id,
      },
      include: [Content],
    });
    res.send(placements);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/contents/:id", async (req, res, next) => {
  try {
    const content = await Content.findByPk(req.params.id, {
      include: [Placement],
    });
    res.send(content);
  } catch (ex) {
    next(ex);
  }
});

const start = async () => {
  try {
    console.log("starting");

    // prevents constant recreation of data, also see package.json
    if (process.env.SYNC) {
      await conn.sync({ force: true });
      const [
        home,
        staff,
        moe,
        lucy,
        faq,
        products,
        foo,
        bar,
        header,
        footer,
        faq1,
        headquarters,
      ] = await Promise.all([
        Page.create({ name: "home" }),
        Page.create({ name: "staff" }),
        Page.create({ name: "moe" }),
        Page.create({ name: "lucy" }),
        Page.create({ name: "faq" }),
        Page.create({ name: "products" }),
        Page.create({ name: "foo" }),
        Page.create({ name: "bar" }),
        Content.create({ name: "header" }),
        Content.create({ name: "footer" }),
        Content.create({ name: "faq1" }),
        Content.create({ name: "headquarters" }),
      ]);
      // changes to objects need to be saved for updates to be applied to db

      staff.parentId = home.id;
      faq.parentId = home.id;
      products.parentId = home.id;
      moe.parentId = staff.id;
      lucy.parentId = staff.id;
      foo.parentId = products.id;
      bar.parentId = products.id;
      await Promise.all([
        staff.save(),
        faq.save(),
        products.save(),
        moe.save(),
        lucy.save(),
        foo.save(),
        bar.save(),
        Placement.create({ contentId: header.id, pageId: home.id }),
        Placement.create({ contentId: header.id, pageId: faq.id }),
        Placement.create({ contentId: footer.id, pageId: home.id }),
        Placement.create({ contentId: footer.id, pageId: faq.id }),
        Placement.create({ contentId: faq1.id, pageId: faq.id }),
        Placement.create({ contentId: headquarters.id, pageId: staff.id }),
        Placement.create({ contentId: headquarters.id, pageId: faq.id }),
      ]);
    }
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`listening on port: ${3000}`);
    });
  } catch (ex) {
    console.log(ex);
  }
};

start();
