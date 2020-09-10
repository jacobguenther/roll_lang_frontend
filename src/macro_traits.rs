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

use crate::web::*;

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
		let macros = macros_from_cookies();
		for (name, data) in &macros {
			add_macro_to_table(name, data.in_bar);
			if data.in_bar {
				add_macro_to_bar(name);
			}
		}
		macros
	}
	fn handle_macro_update_create(&mut self) {
		let name = Elements::get_value_create_macro_name();
		let source = Elements::get_value_create_macro_source();
		let in_bar = Elements::get_value_create_macro_add_shortcut();

		if self.contains_key(&name) {
			// FIX ME replace with update macros row
			Elements::macro_table_row(&name).remove();

			let currently_in_bar = self.get(&name).unwrap().in_bar;
			if in_bar && !currently_in_bar {
				add_macro_to_bar(&name);
			} else if !in_bar && currently_in_bar {
				Elements::macro_shortcut(&name).remove();
			}
		} else if in_bar {
			add_macro_to_bar(&name);
		}
		add_macro_to_table(&name, in_bar);

		let data = MacroData::new(in_bar, &source);
		cookies::add_macro(&name, &data);
		self.insert(name, data);
	}
	fn handle_macro_change_in_bar(&mut self, name: &str) {
		if self.contains_key(name) {
			let mut data = self.get(name).unwrap().clone();
			let currently_in_bar = data.in_bar;
			let in_bar = Elements::get_value_table_row_shortcut_tongle(name);

			if !currently_in_bar && in_bar {
				add_macro_to_bar(name);
			} else if currently_in_bar && !in_bar {
				Elements::macro_shortcut(name).remove();
			}

			data.in_bar = in_bar;
			cookies::add_macro(name, &data);
			self.insert(name.to_string(), data);
		}
	}
	fn handle_macro_delete(&mut self, name: &str) {
		if self.contains_key(name) {
			cookies::remove_macro(name);
			Elements::macro_table_row(name).remove();
			if self.get(name).unwrap().in_bar {
				Elements::macro_shortcut(name).remove();
			}
			self.remove(name);
		}
	}

	fn handle_macro_select(&self, name: &str) {
		let data = self.get(name).unwrap();
		Elements::set_value_create_macro_name(name);
		Elements::set_value_create_macro_source(&data.source);
		Elements::set_value_create_macro_add_shortcut(data.in_bar);
	}
	fn source(&self, name: &str) -> Option<String> {
		let data = self.get(name)?;
		Some(data.source.clone())
	}
}