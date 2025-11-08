
//Function Format: y=mx+b
//solve for y, m, x, or b given the other 3 (what to solve for depends on problem type. If problem_type is m, we solve for slope)
export function linear_equation_solver(val1, val2, val3, problem_type, user_input){
	if (problem_type == "m"){
		// m = (y-b)/x   ----> val1 = y, val2 = b, val3 = x
		if (user_input == (val1-val2)/val3){
			console.log("Correct!");
		}else{
			console.log("Incorrect!");
		}
	}else if(problem_type == "y"){
		// y = mx+b   ----> val1 = m, val2 = x, val3 = b
		if (user_input == val1 * val2 + val3){
			console.log("Correct!");
		}else{
			console.log("Incorrect!");
		}
	}else if(problem_type == "x"){
		// x = (y-b)/m   ----> val1 = y, val2 = b, val3 = m
		if (user_input == (val1-val2)/val3){
			console.log("Correct!");
		}else{
			console.log("Incorrect!");
		}
	}else if(problem_type == "b"){
		// b = y-mx ---> val1 = y, val2 = m, val3 = x
		if (user_input == val1 - val2 * val3){
			console.log("Correct!");
		}else{
			console.log("Incorrect!");
		}

	}
}

linear_equation_solver(2,2,2,"x",0);
