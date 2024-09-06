const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config("../.env");
let chai, fetch, should, expect;

async function load() {
  chai = await import("chai");
  fetch = await import("node-fetch");
  fetch = fetch["default"];
  should = chai.should();
  expect = chai.expect;
}
before(async function () {
  await mongoose.connect("mongodb://localhost:27017/rezervasiya_test");
  await load();
  await User.create({
    username: "testlogin",
    email: "testlogin.s@s.com",
    password: "Testlogin123@",
  });
});

after(function (done) {
  User.deleteMany({})
    .then((data) => {})
    .catch(console.error)
    .finally(done);
});

describe("POST /api/auth/login", () => {
  it("Məlumatlar düzgün daxil edilibsə sistemə daxil olmalıdır", async function () {
    const body = {
      email: "testlogin.s@s.com",
      password: "Testlogin123@",
    };
    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).to.equal(200);
  });

  it("İstifadəçi daxil olduqdan sonra token göndərməlidir", async function () {
    const body = {
      email: "testlogin.s@s.com",
      password: "Testlogin123@",
    };
    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    let { token } = await res.json();

    expect(Boolean(token)).to.be.true;
  });

  it("İstifadəçi daxil olduqdan sonra düzgün token göndərməlidir", async function () {
    const user = {
      email: "testlogin.s@s.com",
      password: "Testlogin123@",
    };
    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });
    let { token } = await res.json();
    let user_info = await jwt.verify(token, process.env["SECRET_KEY"]);
    expect(user_info.email).to.be.equal(user.email);
  });

  it("Şifrə səhv daxil edilibsə sistemə daxil olmamalıdır", async function () {
    const body = {
      email: "testlogin.s@s.com",
      password: "Testlogin123",
    };
    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).to.equal(400);
  });

  it("Email səhv daxil edilibsə sistemə daxil olmamalıdır", async function () {
    const body = {
      email: "testlogin.ds@s.com",
      password: "Testlogin123@",
    };
    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).to.equal(400);
  });
});
