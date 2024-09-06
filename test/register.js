const mongoose = require("mongoose");
const User = require("../models/User");
let chai, fetch, should, expect;
async function load() {
  chai = await import("chai");
  fetch = await import("node-fetch");
  fetch = fetch["default"];
  should = chai.should();
  expect = chai.expect;
}
before(function () {
  mongoose
    .connect("mongodb://localhost:27017/rezervasiya_test")
    .then(async () => await load())
    .catch((error) => {
      console.error(error);
    });
});

after(function (done) {
  User.deleteMany({})
    .then((data) => {})
    .catch(console.error)
    .finally(done);
});
describe("POST /api/auth/register", () => {
  it("Məlumatlar tam və düzgün daxil edilibsə qeydiyyatdan keçməlidir", async function () {
    const body = {
      username: "testc",
      email: "test.s@s.com",
      password: "Test123@",
    };

    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).to.equal(201);
  });
  it("Əgər email qeydiyyatdan keçibsə xəta verməlidir", async function () {
    const body = {
      username: "testsc",
      email: "test.s@s.com",
      password: "Test123@",
    };

    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).to.equal(400);
  });
  it("Kod qaydalara uyğun daxil edilməyibsə qeydiyyatdan keçməməlidir", async function () {
    const body = {
      username: "testaas",
      email: "test.s@s.com",
      password: "Test123@",
    };

    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).to.equal(400);
  });

  it("Email qaydalara uyğun daxil edilməyibsə qeydiyyatdan keçməməlidir", async function () {
    const body = {
      username: "testaas",
      email: "test.ss.com",
      password: "Test123@",
    };

    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).to.equal(400);
  });

  it("Email və kod qaydalara uyğun daxil edilməyibsə qeydiyyatdan keçməməlidir", async function () {
    const body = {
      username: "testaas",
      email: "test.ss.com",
      password: "Test123@",
    };

    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).to.equal(400);
  });

  it("Əgər email qeydiyyatdan keçibsə xəta mesajı 'Bu email artıq qeydiyyatdan keçibdir' olmalıdır", async function () {
    const body = {
      username: "testsc",
      email: "test.s@s.com",
      password: "Test123@",
    };

    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(await res.json()).to.equal("Bu email artıq qeydiyyatdan keçibdir");
  });

  it("Əgər Istifadəçi qeydiyyatdan keçibsə xəta mesajı 'Belə İstifadəçi adı mövcuddur", async function () {
    const body = {
      username: "testc",
      email: "tests@s.com",
      password: "Test123@",
    };

    let res = await fetch(`http://localhost:${process.env["PORT"]}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    expect(await res.json()).to.equal("Belə İstifadəçi adı mövcuddur");
  });
});
