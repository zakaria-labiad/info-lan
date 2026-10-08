run:
	@echo "Running App..."
	npm run dev
	@echo "App completed."

migrate:
	@echo "Running Prisma Migrate..."
	npx prisma migrate dev
	@echo "Prisma Migrate completed."

studio:
	@echo "Running Prisma Studio..."
	npx prisma studio
	@echo "Prisma Studio completed."

generate:
	@echo "Running Prisma Generate..."
	npx prisma generate
	@echo "Prisma Generate completed."

clean:
	@echo Cleaning up...
	@powershell -NoProfile -Command "Remove-Item -Recurse -Force '.next' -ErrorAction SilentlyContinue"
	@echo Cleanup completed.

setup:
	@echo "Setting up the project..."
	npm install
	npx prisma migrate dev
	npx prisma generate
	@echo "Project setup completed."