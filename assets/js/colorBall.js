let canvas, ctx;
let mouseIn = false;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	ctx = canvas.drawingContext;
	canvas.canvas.onmouseenter = () => (mouseIn = true);
	canvas.canvas.onmouseleave = () => (mouseIn = false);
}

function draw() {
	// ctx.globalAlpha = 1;
	blendMode(BLEND);
	background(0);

	stroke(255);
	noFill();

	let o = Date.now() / 3000;

	// let center = createVector(
	// 		width / 5 * cos(o) + width / 2,
	// 		height / 2
	// 	);
	// let center = createVector(cos(o), sin(o))
	// 		.mult(width / 5)
	// 		.add(width / 2, height / 2);
	let center = createVector(width / 2, height / 2);

	translate(center.x, center.y);

	let c = createVector(cos(o * PI), sin(o)).mult(width / 5);
	// .add(width / 2, height / 2);//createVector(0, 0);
	let r = 100;
	let p = createVector(sin(o * 2) * 150, cos(o) * 350);
	let p2;
	if (mouseIn) {
		p2 = createVector(mouseX, mouseY).sub(center);
	} else {
		p2 = createVector(
			sin(o * 1.5 + HALF_PI) * 150,
			cos(o + HALF_PI + QUARTER_PI) * 350
		);
	}

	blendMode(ADD);
	doLight(c.copy(), r, p2.copy(), 1000, "210, 100%, 50%");
	// ctx.globalAlpha = 0.75;
	doLight(c.copy(), r, p.copy().mult(1.2).rotate(o * 4), 1000, "0, 100%, 50%");
	doLight(
		c.copy(),
		r,
		p.copy().mult(1.4).rotate(-o * 5),
		1000,
		"130, 100%, 50%"
	);
}

function doLight(c, r, p, r2, hsl = "0, 0%, 100%") {
	let a = p.copy().add(c).div(2);
	let d_ = c.copy().sub(p);
	let d = d_.mag();

	if (d >= r) {
		let [x1, y1, x2, y2] = intersection(c.x, c.y, r, a.x, a.y, d / 2);
		let va__ = createVector(x1, y1);
		let vb__ = createVector(x2, y2);
		// let va_ = va__.copy().sub(p);
		// let vb_ = vb__.copy().sub(p);
		let vac_ = va__.copy().sub(c);
		let vbc_ = vb__.copy().sub(c);
		// let angle = p5.Vector.angleBetween(va_, vb_);
		// let va = va_.copy().setMag(1000).add(p);
		// let vb = vb_.copy().setMag(1000).add(p);
		// let vac = vac_.copy().setMag(1000).add(c);
		// let vbc = vbc_.copy().setMag(1000).add(c);

		let a_ = vac_.heading();
		let b_ = vbc_.heading();

		ctx.fillStyle = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r2);
		ctx.fillStyle.addColorStop(0.0, `hsla(${hsl}, 1.0)`);
		ctx.fillStyle.addColorStop(0.3, `hsla(${hsl}, 0.7)`);
		ctx.fillStyle.addColorStop(1.0, `hsla(${hsl}, 0.0)`);
		ctx.beginPath();
		ctx.arc(p.x, p.y, r2, a_ + HALF_PI, b_ - HALF_PI, true);
		ctx.arc(c.x, c.y, r, b_, a_, false);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.globalAlpha = 0.325;
		ctx.arc(p.x, p.y, r2, 0, TAU);
		ctx.closePath();
		ctx.fill();

		ctx.globalAlpha = 1.0;

		let d__ = d_.copy().limit(r);

		let grad = ctx.createRadialGradient(
			d__.x + c.x,
			d__.y + c.y,
			0,
			c.x,
			c.y,
			r * 1.1
		);
		grad.addColorStop(0.75, `hsla(${hsl}, 0.0)`);
		grad.addColorStop(1.00, `hsla(${hsl}, ${map(d, r, r2, 1, 0)})`);

		// Attempting to be more realistic.
		// let grad = ctx.createRadialGradient(d__.x + c.x, d__.y + c.y, 0, c.x, c.y, r * 1.1);
		// grad.addColorStop(constrain(map(d, r, r2, 0.5, 0.8), 0, 1), `hsla(${hsl}, 0.0)`);
		// grad.addColorStop(constrain(map(d, r, r2, 0.6, 0.9), 0, 1), `hsla(${hsl}, ${map(d, r, r2, 0.9, 0)})`);

		ctx.fillStyle = grad;
		ctx.beginPath();
		ctx.arc(c.x, c.y, r, 0, TAU);
		ctx.fill();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

// Circle intersection.
// I took this from somewhere on StackOverflow. ¯\_(ツ)_/¯
function intersection(x0, y0, r0, x1, y1, r1) {
	let a, dx, dy, d, h, rx, ry;
	let x2, y2, xi, xi_prime, yi, yi_prime;
	dx = x1 - x0;
	dy = y1 - y0;
	d = sqrt(dy * dy + dx * dx);
	if (d > r0 + r1 || d < abs(r0 - r1)) {
		return false;
	}
	a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d);
	x2 = x0 + dx * a / d;
	y2 = y0 + dy * a / d;
	h = sqrt(r0 * r0 - a * a);
	rx = -dy * (h / d);
	ry = dx * (h / d);
	xi = x2 + rx;
	xi_prime = x2 - rx;
	yi = y2 + ry;
	yi_prime = y2 - ry;
	return [xi, yi, xi_prime, yi_prime];
}
