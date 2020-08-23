// File: wasm_interface.rs

use roll_lang::interpreter::{
	Interpreter,
	InterpreterT,
	output_traits::*,
};

use roll_lang::macros::{
	*
};
use super::macro_traits::{
	*
};

use wasm_bindgen::prelude::*;
use lazy_static::lazy_static;
use std::sync::Mutex;

lazy_static! {
	static ref ARRAY: Mutex<Macros> = Mutex::new(Macros::init());
}

fn rand_func() -> f64 {
	use js_sys::Math::random;
	random()
}
#[wasm_bindgen]
pub fn run(source: &str) -> String {
	let macros = ARRAY.lock().unwrap().clone();
	roll_lang::InterpreterBuilder::new()
		.with_source(source)
		.with_macros(&macros)
		.with_rng_func(rand_func)
		.build()
		.interpret()
		.as_html()
}

#[wasm_bindgen]
pub fn init_panic_hook() {
	console_error_panic_hook::set_once();
}


#[wasm_bindgen]
pub fn init() {
	init_panic_hook();
	let _dummy = ARRAY.lock().unwrap();
}
#[wasm_bindgen]
pub fn handle_macro_update_create() {
	ARRAY.lock().unwrap().handle_macro_update_create();
}
#[wasm_bindgen]
pub fn handle_macro_delete(name: &str) {
	ARRAY.lock().unwrap().handle_macro_delete(name);
}

#[wasm_bindgen]
pub fn handle_macro_select(name: &str) {
	ARRAY.lock().unwrap().handle_macro_select(name);
}
#[wasm_bindgen]
pub fn handle_macro_change_in_bar(name: &str) {
	ARRAY.lock().unwrap().handle_macro_change_in_bar(name);
}
#[wasm_bindgen]
pub fn macro_source(name: &str) -> Option<String> {
	ARRAY.lock().unwrap().source(name)
}
