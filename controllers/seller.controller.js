const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var ObjectId = require("mongodb").ObjectId;

//require Schemas (Mongoose and Yup)
const { Seller, sellerUpdateSchema } = require("../models/seller.model");
const { Group } = require("../models/group.model");
const { Author } = require("../models/author.model");
const {
  Manufacturer,
  yupManufacturerSchema,
} = require("../models/manufacterer.model");

const {
  Shop,
  shopYupSchema,
  shopYupUpdateAddressSchema,
} = require("../models/shop.model");

const {
  Category,
  addCategorySchema,
  categoryUpdateSchema,
} = require("../models/categories.model");

const { Product, yupProductSchema } = require("../models/product.model");
const { Order } = require("../models/order.model");

module.exports = {
  // // show  all Sellers
  getAllSeller: async (req, res) => {
    try {
      // get all sellers data except password property
      let seller = await Seller.find({}, "-password");

      if (seller) {
        res.status(200).send({
          status: "success",
          message: "Sellers got successfully",
          data: seller,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Seller not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getSellerById: async (req, res) => {
    try {
      const sellerId = req?.sellerId;

      // get desired seller data except password
      const seller = await Seller.findById(sellerId, "-password");

      if (seller) {
        res.status(200).send({
          status: "success",
          message: "Seller founded",
          data: seller,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Seller not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  updateSeller: async (req, res) => {
    try {
      const sellerId = req.sellerId;

      const updateFields = req.body;

      updateFields &&
        (await sellerUpdateSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const seller = await Seller.findById(sellerId);

      if (!seller) {
        return res
          .status(404)
          .json({ status: "fail", error: "Seller not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the seller schema
          if (seller.schema.path(field)) {
            // Update the field with the new value
            seller[field] = updateFields[field];
          }
        }
      }

      // Save the updated seller document
      const updatedSeller = await seller.save();

      res.status(200).json({
        status: "success",
        message: "Credential(s) updated successfully",
        data: updatedSeller,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error: ${error}`,
        });
      }
    }
  },

  updateSellerPassword: async (req, res) => {
    try {
      const sellerId = req.sellerId;
      const { oldPassword, newPassword, confirmPassword } = req?.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        res.status(400).json({
          status: "fail",
          error: "All fields are required",
        });
      } else {
        const seller = await Seller.findById(sellerId);
        if (!seller) {
          return res
            .status(404)
            .json({ status: "fail", error: "Seller not found" });
        } else {
          const isMatch = await bcrypt.compare(oldPassword, seller?.password);

          if (isMatch) {
            if (newPassword === confirmPassword) {
              const salt = await bcrypt.genSalt(Number(process.env.SALT));
              const hashedPassword = await bcrypt.hash(newPassword, salt);

              // update password field in privious data
              seller.password = hashedPassword;

              // Save the updated seller document
              const updatedSeller = await seller.save();

              updatedSeller &&
                res.status(200).json({
                  status: "success",
                  message: "Password updated successfully",
                  data: updatedSeller,
                });
            } else {
              res.status(400).json({
                status: "fail",
                error: "New Password And Confirm Password must be same",
              });
            }
          } else {
            res.status(400).json({
              status: "fail",
              error: "Invalid old Password",
            });
          }
        }
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  deleteSeller: async (req, res) => {
    try {
      const sellerId = req.params?.sellerId;

      let deletedResult = await Seller.findByIdAndDelete(sellerId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Seller deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Seller not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  //----------------------Group---------------------

  getAllGroup: async (req, res) => {
    try {
      // get all groups data
      let group = await Group.find({});

      if (group) {
        res.status(200).send({
          status: "success",
          message: "Groups got successfully",
          data: group,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Group not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getGroupById: async (req, res) => {
    try {
      const groupId = req.params?.groupId;

      // get desired group data
      const group = await Group.findById(groupId);

      if (group) {
        res.status(200).send({
          status: "success",
          message: "Group founded",
          data: group,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Group not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  // ---------------------Author---------------
  addAuthor: async (req, res) => {
    try {
      let authorData = req.body;

      authorData &&
        (await addAuthorSchema.validate(authorData, {
          abortEarly: false,
        }));

      const author = new Author(authorData);

      const result = await author.save();

      result &&
        res.status(200).send({
          status: "success",
          message: "Author added Successfully",
          data: result,
        });
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  // // show  all Authors
  getAllAuthor: async (req, res) => {
    try {
      // get all authors data except password property
      let author = await Author.find({});

      if (author) {
        res.status(200).send({
          status: "success",
          message: "Authors got successfully",
          data: author,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Author not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getAuthorById: async (req, res) => {
    try {
      const authorId = req.params?.authorId;

      // get desired author data
      const author = await Author.findById(authorId);

      if (author) {
        res.status(200).send({
          status: "success",
          message: "Author founded",
          data: author,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Author not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  // <------------------Manufacturer-------------------->

  addManufacturer: async (req, res) => {
    try {
      let manufacturerData = req.body;

      manufacturerData &&
        (await yupManufacturerSchema.validate(manufacturerData, {
          abortEarly: false,
        }));
      const groupExist = await Group.findById(manufacturerData?.groupId);
      if (groupExist) {
        const manufacturer = new Manufacturer(manufacturerData);

        const result = await manufacturer.save();

        result &&
          res.status(200).send({
            status: "success",
            message: "Manufacturer added Successfully",
            data: result,
          });
      } else {
        res.status(401).send({
          status: "fail",
          error: "Group not found",
        });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  // // show  all Manufacturers
  getAllManufacturer: async (req, res) => {
    try {
      // get all manufacturers data
      let manufacturer = await Manufacturer.find({});

      if (manufacturer) {
        res.status(200).send({
          status: "success",
          message: "Manufacturers got successfully",
          data: manufacturer,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Manufacturer not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  // <------------------Shop-------------------->

  addShop: async (req, res) => {
    try {
      // debugger;

      let shopData = req.body;

      shopData &&
        (await shopYupSchema.validate(shopData, {
          abortEarly: false,
        }));

      const sellerExist = await Seller.findById(
        shopData?.sellerId,
        "-password"
      );

      if (sellerExist) {
        const shop = new Shop(shopData);

        const result = await shop.save();
        result &&
          res.status(200).send({
            status: "success",
            message: "Shop added Successfully",
            data: result,
          });
      } else {
        res.status(400).send({
          status: "fail",
          error: "SellerId not Found",
        });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });

        console.log("error:---", error);
        return res.status(400).json(error?.message);
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  getShopById: async (req, res) => {
    try {
      const shopId = req.params?.shopId;
      // get desired shop data
      const shop = await Shop.findById(shopId);

      if (shop) {
        res.status(200).send({
          status: "success",
          message: "Shop founded",
          data: shop,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Shop not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);

      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  updateShop: async (req, res) => {
    try {
      const shopId = req?.params?.shopId;

      const updateFields = req.body;

      updateFields &&
        (await shopYupSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const shop = await Shop.findById(shopId);

      if (!shop) {
        return res
          .status(404)
          .json({ status: "fail", error: "Shop not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the shop schema
          if (shop.schema.path(field)) {
            // Update the field with the new value
            shop[field] = updateFields[field];
          }
        }
      }

      const sellerExist = await Seller.findById(shop?.sellerId, "-password");

      if (sellerExist) {
        // Save the updated shop document
        const updatedShop = await shop.save();

        res.status(200).json({
          status: "success",
          message: "Shop updated successfully",
          data: updatedShop,
        });
      } else {
        res.status(400).send({
          status: "fail",
          error: "SellerId not Found",
        });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error: ${error}`,
        });
      }
    }
  },

  updateShopAddresses: async (req, res) => {
    try {
      const shopId = req?.params?.shopId;

      // Get the shop document by ID
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return res
          .status(404)
          .json({ status: "fail", error: "Shop not found" });
      }
      console.log("body", req.body);
      req?.body &&
        (await shopYupUpdateAddressSchema.validate(req?.body, {
          abortEarly: false,
        }));

      const { country, city, state, zip, streetAddress } = req.body;
      shop.shopAddress = {
        country,
        city,
        state,
        zip,
        streetAddress,
      };

      // Save the updated shop document
      const updatedShop = await shop.save();

      res.status(200).json({
        status: "success",
        message: `shop address updated successfully`,
        data: updatedShop,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error: ${error}`,
        });
      }
    }
  },

  // <------------Categories-------------->

  // // show  all Categorys
  getAllCategory: async (req, res) => {
    try {
      // get all categorys data
      let category = await Category.find({});

      if (category) {
        res.status(200).send({
          status: "success",
          message: "Categorys got successfully",
          data: category,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Category not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const categoryId = req.params?.categoryId;

      // get desired category data
      const category = await Category.findById(categoryId);

      if (category) {
        res.status(200).send({
          status: "success",
          message: "Category founded",
          data: category,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Category not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  // <------------Products-------------->

  addProduct: async (req, res) => {
    try {
      let productData = req.body;

      productData &&
        (await yupProductSchema.validate(productData, {
          abortEarly: false,
        }));

      let groupExist = await Group.findOne({ name: productData?.groupName });

      // validate same name
      if (!groupExist) {
        res.status(400).json({
          status: "fail",
          error: "Invalid Group Name",
        });
      } else {
        productData.groupId = groupExist?._id;
        let categoryExist = await Category.findOne({
          name: productData?.categoryName,
        });

        if (categoryExist) {
          productData.categoryId = categoryExist?._id;

          let authorExist = await Author.findOne({
            name: productData?.authorName,
          });

          if (authorExist) {
            let manufacturerExist = await Manufacturer.findOne({
              name: productData?.manufacturerName,
            });
            if (manufacturerExist) {
              let shopExist = await Shop.findById(productData?.shopId);

              if (shopExist) {
                productData.shopName = shopExist?.name;

                const product = new Product(productData);

                const result = await product.save();

                result &&
                  res.status(200).send({
                    status: "success",
                    message: "Product added Successfully",
                    data: result,
                  });
              } else {
                res.status(400).json({
                  status: "fail",
                  error: "Shop not Exist",
                });
              }
            } else {
              res.status(400).json({
                status: "fail",
                error: "Manufacturer not Exist",
              });
            }
          } else {
            res.status(400).json({
              status: "fail",
              error: "Author not Exist",
            });
          }
        } else {
          res.status(400).json({
            status: "fail",
            error: "category not Exist",
          });
        }
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  // // show  all Products
  getAllShopProduct: async (req, res) => {
    try {
      const sellerId = req.sellerId;
      console.log("sellerId:", sellerId);
      const shop = await Shop.findOne({ sellerId: sellerId });
      console.log("Shop:", shop);
      // get all products data
      let product = await Product.find({ shopId: shop?._id });

      if (product) {
        res.status(200).send({
          status: "success",
          message: "Products got successfully",
          data: product,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Product not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getShopProductById: async (req, res) => {
    try {
      const { productId } = req.params;
      const shopId = req.body;
      // get desired product data
      const product = await Product.findOne({ _id: productId, shopId: shopId });

      if (product) {
        res.status(200).send({
          status: "success",
          message: "Product founded",
          data: product,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Product not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { productId } = req?.params;
      const shopId = req.body;

      const updateFields = req.body;

      updateFields &&
        (await yupProductSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const product = await Product.findOne({ _id: productId, shopId: shopId });

      if (!product) {
        return res
          .status(404)
          .json({ status: "fail", error: "Product not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the product schema
          if (product.schema.path(field)) {
            // Update the field with the new value
            product[field] = updateFields[field];
          }
        }
      }

      let groupExist = await Group.findOne({ name: product?.groupName });

      // validate same name
      if (!groupExist) {
        res.status(400).json({
          status: "fail",
          error: "Invalid Group Name",
        });
      } else {
        product.groupId = groupExist?._id;
        let categoryExist = await Category.findOne({
          name: product?.categoryName,
        });

        if (categoryExist) {
          product.categoryId = categoryExist?._id;

          let authorExist = await Author.findOne({
            name: product?.authorName,
          });

          if (authorExist) {
            let manufacturerExist = await Manufacturer.findOne({
              name: product?.manufacturerName,
            });
            if (manufacturerExist) {
              let shopExist = await Shop.findById(product?.shopId);

              if (shopExist) {
                product.shopName = shopExist?.name;

                const updatedProduct = await product.save();

                updatedProduct &&
                  res.status(200).json({
                    status: "success",
                    message: "Product updated successfully",
                    data: updatedProduct,
                  });
              } else {
                res.status(400).json({
                  status: "fail",
                  error: "Shop not Exist",
                });
              }
            } else {
              res.status(400).json({
                status: "fail",
                error: "Manufacturer not Exist",
              });
            }
          } else {
            res.status(400).json({
              status: "fail",
              error: "Author not Exist",
            });
          }
        } else {
          res.status(400).json({
            status: "fail",
            error: "category not Exist",
          });
        }
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params?.productId;

      let deletedResult = await Product.findByIdAndDelete(productId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Product deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Product not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  // <----------Orders------------------------>

  // // show  all Orders
  getAllOrder: async (req, res) => {
    try {
      const sellerId = req.sellerId;
      const shop = await Shop.findOne({ sellerId: sellerId });
      // get all orders data

      if (!shop) {
        return res.status(401).json({
          status: "fail",
          error: "No orders found for that particular shop",
        });
      }

      const orders = await Order.find({
        items: {
          $elemMatch: {
            shopId: shop?._id,
          },
        },
      });

      if (orders && orders.length > 0) {
        res.status(200).json({
          status: "success",
          message: "Orders founded for that specified seller",
          data: orders,
        });
      } else {
        res.status(404).json({
          status: "fail",
          error: "No orders found for that specified seller",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const orderId = req.params?.orderId;
      const customerId = req.customerId;

      // get desired order data
      const order = await Order.findOne({
        _id: orderId,
        customerId: customerId,
      });

      if (order) {
        res.status(200).send({
          status: "success",
          message: "Order founded",
          data: order,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Order not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const orderId = req?.params?.orderId;

      const updateFields = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json({ status: "fail", error: "Order not found" });
      }

      const { status } = req.body;
      if (
        status === "Pending" ||
        status === "Order Processing" ||
        status === "Order At Local Facility" ||
        status === "Order Out For Delivery" ||
        status === "Order Completed"
      ) {
        const updatedOrder = await order.updateOne(
          { _id: orderId },
          { $set: { status: status } }
        );

        updatedOrder &&
          res.status(200).json({
            status: "success",
            message: "Order updated successfully",
            data: updatedOrder,
          });
      } else {
        return res
          .status(404)
          .json({ status: "fail", error: "Invalid Status" });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },
};
