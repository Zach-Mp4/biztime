const express = require("express");
const slugify = require ("slugify");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM industries`);
      industries = results.rows;
      for (let industry of industries){
        companies = await db.query(`SELECT c.code FROM companies AS c LEFT JOIN industries_companies AS ci ON c.code = ci.comp_code LEFT JOIN industries AS i ON ci.industry_code = i.code WHERE ci.industry_code = $1`, [industry.code]);
        industry.companies = companies.rows;
      }
      return res.status(201).json(industries);
    } catch (e) {
      return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
      const { code, industry} = req.body;
      const results = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry', [code, industry]);
      return res.status(201).json({ industry: results.rows[0] })
    } catch (e) {
      return next(e)
    }
})

router.put('/associate', async (req, res, next) => {
    try {
      const {comp_code, industry_code} = req.body;
      const results = await db.query('INSERT INTO industries_companies (comp_code, industry_code) VALUES ($1, $2) returning comp_code, industry_code', [comp_code, industry_code]);
      return res.status(201).json({ industry_company: results.rows[0] });
    } catch (e) {
      return next(e)
    }
})




module.exports = router;