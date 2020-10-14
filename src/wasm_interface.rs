// File: src/wasm_interface.rs

// Copyright (C) 2020  Jacob Guenther
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

use roll_lang::{interpreter::InterpreterT, macros::*};

use super::{macro_traits::*, output_traits::*, *};

use serde::{Serialize, Deserialize};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;


static INIT_MACROS: std::sync::Once = std::sync::Once::new();
static mut MACROS: Option<Macros> = None;
pub fn macros() -> &'static mut Macros {
	unsafe {
		INIT_MACROS.call_once(|| {
			MACROS = Some(Macros::init());
		});
		MACROS.as_mut().unwrap()
	}
}

use crate::web;
#[wasm_bindgen]
pub fn init_wasm(ids: &JsValue) {
	console_error_panic_hook::set_once();
	crate::web::init_ids(ids);
	let _dummy = macros();
}

#[wasm_bindgen]
pub fn run(source: &str) -> String {
	roll_lang::InterpreterBuilder::new()
		.with_source(source)
		.with_macros(macros())
		.with_rng_func(rand_func)
		.with_query_prompter(prompt)
		.build()
		.interpret()
		.as_html()
}

#[derive(Serialize, Deserialize)]
pub struct JsMacro {
	name: String,
	source: String,
	has_shortcut: bool,
}

#[wasm_bindgen]
pub fn add_macros(val: &JsValue) {
	let elements: Vec<JsMacro> = val.into_serde().unwrap();
	let macros = macros();
	elements
		.iter()
		.for_each(|e| {
			macros.insert(e.name.clone(), e.source.clone());
		});
}
#[wasm_bindgen]
pub fn add_macro(val: &JsValue) {
	let m: JsMacro = val.into_serde().unwrap();
	macros()
		.insert(m.name.clone(), m.source.clone());
}
#[wasm_bindgen]
pub fn remove_macro(name: &str) {
	macros().remove(name);
}
#[wasm_bindgen]
pub fn macro_source(name: &str) -> Option<String> {
	macros().source(name)
}
