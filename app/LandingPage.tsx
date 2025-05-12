"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Developers from "@/components/landing/Developers";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { useUser } from "@civic/auth-web3/react";
import { useAuth } from "@/lib/use-auth";

export default function LandingPage() {
	const civicUser: any = useUser();
	const router = useRouter();
	const { isLoading, isAuthenticated } = useAuth();
	const [isScrolled, setIsScrolled] = useState(false);
	const heroRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isLoading, isAuthenticated, router]);

	const handleLogin = async () => {
		try {
			await civicUser.signIn();
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	console.log("Civic user", civicUser);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mx-auto"></div>
					<p className="mt-4">Loading...</p>
				</div>
			</div>
		);
	}


	return (
		<div>
			<div className="min-h-screen bg-[#050510] text-white overflow-hidden">
				{/* Animated Background */}
				<div className="fixed inset-0 z-0">
					<AnimatedBackground />
				</div>

				{/* Header */}
				<Header isScrolled={isScrolled} onLogin={handleLogin} />

				{/* Hero Section */}
				<Hero heroRef={heroRef} />

				{/* Features Section */}
				<Features />

				{/* Developer Section */}
				<Developers />

				{/* CTA Section */}
				<CTA onLogin={handleLogin} user={civicUser.user} />

				{/* Footer */}
				<Footer />
			</div>
		</div>
	);
}

// Animated Background Component
function AnimatedBackground() {
	return (
		<div className="relative w-full h-full overflow-hidden">
			{/* Grid pattern */}
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxYTFhMzAiIGQ9Ik0zNiAxOGgtMTJ2MTJoMTJ6Ii8+PHBhdGggc3Ryb2tlPSIjMWExYTMwIiBzdHJva2Utb3BhY2l0eT0iLjUiIGQ9Ik0zMCAwdjYwbTMwLTMwSDBtNjAgMEgwbTYwLTMwSDBtNjAgMEgwIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

			{/* Gradient blobs */}
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
			<div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
			<div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

			{/* Particles */}
			<div className="absolute inset-0">
				<Particles />
			</div>
		</div>
	);
}

// Particles Component
function Particles() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let particles: Particle[] = [];
		let animationFrameId: number;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initParticles();
		};

		class Particle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			color: string;

			constructor() {
				this.x = Math.random() * (canvas?.width || 0);
				this.y = Math.random() * (canvas?.height || 0);
				this.size = Math.random() * 2;
				this.speedX = (Math.random() - 0.5) * 0.5;
				this.speedY = (Math.random() - 0.5) * 0.5;
				this.color = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
			}

			update() {
				this.x += this.speedX;
				this.y += this.speedY;

				if (canvas) {
					if (this.x > canvas.width) this.x = 0;
					else if (this.x < 0) this.x = canvas.width;

					if (this.y > canvas.height) this.y = 0;
					else if (this.y < 0) this.y = canvas.height;
				}
			}

			draw() {
				if (ctx) {
					ctx.fillStyle = this.color;
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}

		const initParticles = () => {
			particles = [];
			const particleCount = Math.floor((canvas.width * canvas.height) / 10000);

			for (let i = 0; i < particleCount; i++) {
				particles.push(new Particle());
			}
		};

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach((particle) => {
				particle.update();
				particle.draw();
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <canvas ref={canvasRef} className="w-full h-full" />;
}
