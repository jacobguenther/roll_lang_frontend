// File: src/lib.rs

/*
338,
306,164
303,019
*/

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

pub mod macro_traits;
pub mod output_traits;
pub mod wasm_interface;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
	#[wasm_bindgen(js_namespace = console)]
	fn log(s: &str);

	#[wasm_bindgen(js_namespace = console, js_name = log)]
	fn log_u32(a: u32);

	#[wasm_bindgen(js_namespace = console, js_name = log)]
	fn log_many(a: &str, b: &str);
}

#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

fn rand_func() -> f64 {
	use js_sys::Math::random;
	random()
}
fn prompt(message: &str, default: &str) -> Option<String> {
	web_sys::window()
		.unwrap()
		.prompt_with_message_and_default(message, default)
		.unwrap_or(None)
}
