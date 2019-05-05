<?php require_once "header.php"; ?>

<!-- Page Heading
		================================================== -->
<div class="page-heading">
	<div class="container">
		<div class="row">
			<div class="col-md-10 offset-md-1">
				<h1 class="page-heading__title">Photo <span class="highlight">Gallery</span></h1>
				<ol class="page-heading__breadcrumb breadcrumb">
					<li class="breadcrumb-item"><a href="/">Home</a></li>
					<li class="breadcrumb-item active" aria-current="page">Gallery</li>
				</ol>
			</div>
		</div>
	</div>
</div>
<!-- Page Heading / End -->

<!-- Content
    ================================================== -->
<div class="site-content">
	<div class="container">
		<!--================gallery Area =================-->
		<section class="gallery" data-featherlight-target-attr="src">
			<div class="container">
				<div class="main_title">
					<h2>Our Recent Completed gallery</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
						eiusmod tempor
					</p>
				</div>
				<div class="gallery_fillter">
					<ul class="filter categories">
						<li class="active" data-filter="*">
							<a href="#">All Categories</a>
						</li>
						<li data-filter=".brand"><a href="#">Branding</a></li>
						<li data-filter=".work"><a href="#">Creative Work </a></li>
						<li data-filter=".web"><a href="#">Web Design</a></li>
					</ul>
				</div>
				<div class="gallery_inner row" data-featherlight-gallery data-featherlight-filter="a">
					<div class="col-lg-4 col-sm-6 brand web">
						<div class="gallery_item">
							<a class="gallery_img" href="assets/images/gallery/projects-1.jpg" />
							<img class="img-fluid" src="assets/images/gallery/projects-1.jpg" alt="" />
							<div class="gallery_text">
								<h4>3D Helmet Design</h4>
								<p>Client Project</p>
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-sm-6 brand work">
						<div class="gallery_item">
							<img class="img-fluid" src="assets/images/gallery/projects-2.jpg" alt="" />
							<div class="gallery_text">
								<h4>3D Helmet Design</h4>
								<p>Client Project</p>
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-sm-6 work">
						<div class="gallery_item">
							<img class="img-fluid" src="assets/images/gallery/projects-3.jpg" alt="" />
							<div class="gallery_text">
								<a href="portfolio-details.html">
									<h4>3D Helmet Design</h4>
								</a>
								<p>Client Project</p>
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-sm-6 brand web">
						<div class="gallery_item">
							<img class="img-fluid" src="assets/images/gallery/projects-4.jpg" alt="" />
							<div class="gallery_text">
								<a href="portfolio-details.html">
									<h4>3D Helmet Design</h4>
								</a>
								<p>Client Project</p>
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-sm-6 brand work">
						<div class="gallery_item">
							<img class="img-fluid" src="assets/images/gallery/projects-5.jpg" alt="" />
							<div class="gallery_text">
								<a href="portfolio-details.html">
									<h4>3D Helmet Design</h4>
								</a>
								<p>Client Project</p>
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-sm-6 brand work web">
						<div class="gallery_item">
							<img class="img-fluid" src="assets/images/gallery/projects-6.jpg" alt="" />
							<div class="gallery_text">
								<a href="portfolio-details.html">
									<h4>3D Helmet Design</h4>
								</a>
								<p>Client Project</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!--================End gallery Area =================-->

	</div>
</div>
<!-- Content / End -->

<?php require_once "footer.php"; ?>