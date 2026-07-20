package main

import (
	"fmt"
	"log"

	"github.com/tyrellcurry/invoiceApp/internal/config"
	"github.com/tyrellcurry/invoiceApp/internal/database"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := database.Migrate(db); err != nil {
		log.Fatal(err)
	}

	fmt.Println("migrations applied, db ready")
}
