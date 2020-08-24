// src/macros_traits.rs


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

use roll_lang::macros::*;

use crate::web;

// #[macro_use]
// use super::*;

pub trait MacrosWebT {
	fn init() -> Macros;
	fn handle_macro_update_create(&mut self);
	fn handle_macro_change_in_bar(&mut self, name: &str);
	fn handle_macro_delete(&mut self, name: &str);

	fn handle_macro_select(&self, name: &str);

	fn source(&self, name: &str) -> Option<String>;
}



impl MacrosWebT for Macros {
	fn init() -> Macros {
		let macros = web::macros_from_cookies();
		for (name, data) in &macros {
			web::add_macro_to_table(name, data.in_bar);
			if data.in_bar {
				web::add_macro_to_bar(name);
			}
		}
		macros
	}
	fn handle_macro_update_create(&mut self) {
		let name = web::get_value::macros::create::name();
		let in_bar = web::get_value::macros::create::checkbox();
		let source = web::get_value::macros::create::source();

		if self.contains_key(&name) {
			// FIX ME replace with update macros row
			web::remove_macro_from_table(&name);

			let currently_in_bar = self.get(&name).unwrap().in_bar;
			if in_bar && !currently_in_bar {
				web::add_macro_to_bar(&name);
			} else if !in_bar && currently_in_bar {
				web::remove_macro_from_bar(&name);
			}
		} else {
			if in_bar {
				web::add_macro_to_bar(&name);
			}
		}
		web::add_macro_to_table(&name, in_bar);

		let data = MacroData::new(in_bar, &source);
		web::cookies::add_macro(&name, &data);
		self.insert(name, data);
	}
	fn handle_macro_change_in_bar(&mut self, name: &str) {
		if self.contains_key(name) {
			let mut data = self.get(name).unwrap().clone();
			let currently_in_bar = data.in_bar;
			let in_bar = web::get_value::macros::row_checkbox(name);
			
			if !currently_in_bar && in_bar {
				web::add_macro_to_bar(name);
			} else if currently_in_bar && !in_bar {
				web::remove_macro_from_bar(name);
			}

			data.in_bar = in_bar;
			web::cookies::add_macro(name, &data);
			self.insert(name.to_string(), data);
		}
	}
	fn handle_macro_delete(&mut self, name: &str) {
		if self.contains_key(name) {
			web::cookies::remove_macro(name);
			web::remove_macro_from_table(name);
			if self.get(name).unwrap().in_bar {
				web::remove_macro_from_bar(name);
			}
			self.remove(name);
		}
	}

	fn handle_macro_select(&self, name: &str) {
		use web::id;
		use wasm_bindgen::JsCast;
		web::element::get_element(&id::macros::create_mod::name())
			.dyn_ref::<web_sys::HtmlInputElement>().unwrap()
			.set_value(name);

		let data = self.get(name).unwrap();
		web::element::get_element(&id::macros::create_mod::source())
			.dyn_ref::<web_sys::HtmlTextAreaElement>().unwrap()
			.set_value(&data.source);

		web::element::get_element(&id::macros::create_mod::shortcut_checkbox())
			.dyn_ref::<web_sys::HtmlInputElement>().unwrap()
			.set_checked(data.in_bar);	
	}
	fn source(&self, name: &str) -> Option<String> {
		let data = self.get(name)?;
		Some(data.source.clone())
	}
}