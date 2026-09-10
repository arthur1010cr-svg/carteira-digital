import test from "node:test";
import assert from "node:assert/strict";
import { corHexValida, emailValido, valorMonetarioValido } from "../src/services/validationService.js";

test("aceita e-mail válido", () => assert.equal(emailValido("ana@exemplo.com"), true));
test("rejeita valor monetário inválido", () => assert.equal(valorMonetarioValido("2.345"), false));
test("valida cor hexadecimal", () => { assert.equal(corHexValida("#2b5c8a"), true); assert.equal(corHexValida("azul"), false); });
