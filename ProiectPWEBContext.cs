using System;
using System.Collections.Generic;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Type = DataAccess.Models.Type;

namespace DataAccess
{
    public partial class ProiectPWEBContext : DbContext
    {
        public ProiectPWEBContext()
        {
        }

        public ProiectPWEBContext(DbContextOptions<ProiectPWEBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<City> Cities { get; set; } = null!;
        public virtual DbSet<Color> Colors { get; set; } = null!;
        public virtual DbSet<Interval> Intervals { get; set; } = null!;
        public virtual DbSet<Offer> Offers { get; set; } = null!;
        public virtual DbSet<Position> Positions { get; set; } = null!;
        public virtual DbSet<Producer> Producers { get; set; } = null!;
        public virtual DbSet<Request> Requests { get; set; } = null!;
        public virtual DbSet<RequestState> RequestStates { get; set; } = null!;
        public virtual DbSet<Size> Sizes { get; set; } = null!;
        public virtual DbSet<Type> Types { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=CarSharing;TrustServerCertificate=true;Integrated Security=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<City>(entity =>
            {
                entity.ToTable("City");

                entity.Property(e => e.CityId).ValueGeneratedNever();

                entity.Property(e => e.Judet).HasMaxLength(50);

                entity.Property(e => e.Nume).HasMaxLength(50);
            });

            modelBuilder.Entity<Color>(entity =>
            {
                entity.Property(e => e.ColorId)
                    .ValueGeneratedNever()
                    .HasColumnName("ColorID");

                entity.Property(e => e.ColorName).HasMaxLength(50);
            });

            modelBuilder.Entity<Interval>(entity =>
            {
                entity.HasKey(e => e.DateId);

                entity.Property(e => e.DateId)
                    .ValueGeneratedNever()
                    .HasColumnName("DateID");

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.HasMany(d => d.Offers)
                    .WithMany(p => p.Dates)
                    .UsingEntity<Dictionary<string, object>>(
                        "OfferAvailableInterval",
                        l => l.HasOne<Offer>().WithMany().HasForeignKey("OfferId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_OfferAvailableIntervals\\_Offer"),
                        r => r.HasOne<Interval>().WithMany().HasForeignKey("DateId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_OfferAvailableIntervals\\_Intervals"),
                        j =>
                        {
                            j.HasKey("DateId", "OfferId").HasName("PK_OfferAvailableIntervals\\");

                            j.ToTable("OfferAvailableIntervals");

                            j.IndexerProperty<Guid>("DateId").HasColumnName("DateID");

                            j.IndexerProperty<Guid>("OfferId").HasColumnName("OfferID");
                        });
            });

            modelBuilder.Entity<Offer>(entity =>
            {
                entity.ToTable("Offer");

                entity.Property(e => e.OfferId).ValueGeneratedNever();

                entity.Property(e => e.ColorId).HasColumnName("ColorID");

                entity.Property(e => e.OwnerId).HasColumnName("OwnerID");

                entity.Property(e => e.PositionId).HasColumnName("PositionID");

                entity.Property(e => e.ProducerId).HasColumnName("ProducerID");

                entity.Property(e => e.SizeId).HasColumnName("SizeID");

                entity.Property(e => e.TypeId).HasColumnName("TypeID");

                entity.HasOne(d => d.Color)
                    .WithMany(p => p.Offers)
                    .HasForeignKey(d => d.ColorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Offer_Colors");

                entity.HasOne(d => d.Owner)
                    .WithMany(p => p.Offers)
                    .HasForeignKey(d => d.OwnerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Offer_User");

                entity.HasOne(d => d.Position)
                    .WithMany(p => p.Offers)
                    .HasForeignKey(d => d.PositionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Offer__PositionI__07C12930");

                entity.HasOne(d => d.Producer)
                    .WithMany(p => p.Offers)
                    .HasForeignKey(d => d.ProducerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Offer_Producers");

                entity.HasOne(d => d.Size)
                    .WithMany(p => p.Offers)
                    .HasForeignKey(d => d.SizeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Offer_Sizes");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.Offers)
                    .HasForeignKey(d => d.TypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Offer_Types");
            });

            modelBuilder.Entity<Position>(entity =>
            {
                entity.ToTable("Position");

                entity.Property(e => e.PositionId)
                    .ValueGeneratedNever()
                    .HasColumnName("PositionID");

                entity.Property(e => e.Xcoordinate)
                    .HasColumnType("numeric(18, 5)")
                    .HasColumnName("XCoordinate");

                entity.Property(e => e.Ycoordinate)
                    .HasColumnType("numeric(18, 5)")
                    .HasColumnName("YCoordinate");
            });

            modelBuilder.Entity<Producer>(entity =>
            {
                entity.Property(e => e.ProducerId).ValueGeneratedNever();

                entity.Property(e => e.ProducerName).HasMaxLength(50);
            });

            modelBuilder.Entity<Request>(entity =>
            {
                entity.ToTable("Request");

                entity.Property(e => e.RequestId)
                    .ValueGeneratedNever()
                    .HasColumnName("RequestID");

                entity.Property(e => e.BorrowerId).HasColumnName("BorrowerID");

                entity.Property(e => e.IntervalId).HasColumnName("IntervalID");

                entity.Property(e => e.OfferId).HasColumnName("OfferID");

                entity.Property(e => e.StateId).HasColumnName("StateID");

                entity.HasOne(d => d.Borrower)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(d => d.BorrowerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Request_User");

                entity.HasOne(d => d.Interval)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(d => d.IntervalId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Request_Intervals");

                entity.HasOne(d => d.Offer)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(d => d.OfferId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Request_Offer");

                entity.HasOne(d => d.State)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(d => d.StateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Request_RequestState");
            });

            modelBuilder.Entity<RequestState>(entity =>
            {
                entity.HasKey(e => e.StateId);

                entity.ToTable("RequestState");

                entity.Property(e => e.StateId)
                    .ValueGeneratedNever()
                    .HasColumnName("StateID");

                entity.Property(e => e.State).HasMaxLength(50);
            });

            modelBuilder.Entity<Size>(entity =>
            {
                entity.Property(e => e.SizeId)
                    .ValueGeneratedNever()
                    .HasColumnName("SizeID");

                entity.Property(e => e.SizeName).HasMaxLength(50);
            });

            modelBuilder.Entity<Type>(entity =>
            {
                entity.Property(e => e.TypeId)
                    .ValueGeneratedNever()
                    .HasColumnName("TypeID");

                entity.Property(e => e.TypeName).HasMaxLength(50);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.UserId).ValueGeneratedNever();

                entity.Property(e => e.Email).HasMaxLength(50);

                entity.Property(e => e.FirstName).HasMaxLength(50);

                entity.Property(e => e.LastName).HasMaxLength(50);

                entity.Property(e => e.Password).HasMaxLength(50);

                entity.Property(e => e.PhoneNumber).HasMaxLength(50);

                entity.Property(e => e.Photo).HasColumnType("image");

                entity.Property(e => e.UserName).HasMaxLength(50);

                entity.HasOne(d => d.City)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.CityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_City");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
