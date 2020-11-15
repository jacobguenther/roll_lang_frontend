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

pub trait MacrosWebT {
	fn init() -> Macros;

	fn source(&self, name: &str) -> Option<String>;
}

impl MacrosWebT for Macros {
	fn init() -> Macros {
		Macros::new()
	}
	fn source(&self, name: &str) -> Option<String> {
		let source = self.get(name)?;
		Some(source.clone())
	}
}
