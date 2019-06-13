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
		<section class="gallery p_120" id="gallery">
			<div class="container">
				<div class="gallery__filter">
					<ul class="filter list-items">
						<li class="active" data-filter="*">
							<a href="#">All Categories</a>
						</li>
						<li data-filter=".brand"><a href="#">Branding</a></li>
						<li data-filter=".webdev"><a href="#">Web Development</a></li>
						<li data-filter=".web"><a href="#">Web Design</a></li>
					</ul>
				</div>
				<div class="gallery__inner row">
					<div class="col-lg-4 col-sm-6 brand">
						<div class="gallery__item">
							<figure>
								<img class="img-fluid" src="assets\images\gallery\projects-1.jpg" alt="" />
								<figcaption class="gallery__text">
									<h4>Confidence Cougars</h4>
									<a data-src="assets\images\gallery\projects-1.jpg" data-fancybox="gallery" data-caption='
                    <div class="gallery__text--caption">
                      <p>Local Basketball Team</p>
                      <a href="http://thatcougarlife.com/" target="blank">
                         Website
                      </a>
                        |
                      <a href="https://github.com/spward/Confidence-Cougars" target="blank">
                        <span>Repo</span> <i class="fab fa-github"></i>
                      </a>

                    </div>'>
									</a>
									<p>Client Project</p>
								</figcaption>
							</figure>
						</div>
					</div>
					<div class="col-lg-4 col-sm-6 webdev">
						<div class="gallery__item">
							<figure>
								<img class="img-fluid" src="assets\images\gallery\projects-2.jpg" alt="" />
								<figcaption class="gallery__text">
									<h4>Phoenix Rising</h4>
									<a data-src="assets\images\gallery\projects-2.jpg" data-fancybox="gallery" data-caption='
                    <div class="gallery__text--caption">
                      <p>Phoenix Rising League is an eSports team for a game called League of Legends. I worked on Twitch stream emotes.</p>
                      <a href="https://www.phoenixrisingleague.com/" target="blank">
                         Website
                      </a>
                    </div>'>
									</a>
									<p>Client Project</p>
								</figcaption>
							</figure>
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