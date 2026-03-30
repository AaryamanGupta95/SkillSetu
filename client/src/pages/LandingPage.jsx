import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, BookOpen, Users, Star, GraduationCap, Zap, TrendingUp, Award, Code, PenTool, Globe, Palette, Camera, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const stepsRef = useRef([]);
  const mentorRefs = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(titleRef.current,
      { y: 60, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.out' }
    )
    .fromTo(subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
      '-=0.7'
    )
    .fromTo(ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(statsRef.current?.children ? Array.from(statsRef.current.children) : [],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.3'
    );

    // Animate step cards
    stepsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, delay: 0.3 + i * 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    });

    // Animate mentor cards
    mentorRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, delay: 0.2 + i * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    });
  }, []);

  const mentors = [
    { 
      name: 'Rahul Verma', 
      skill: 'Senior Fullstack Engineer', 
      location: 'Bangalore / Worldwide',
      approach: 'Focus on logic-first architecture, clean code practices, and scalable backend systems.',
      rating: '4.9', 
      sessions: '124', 
      avatarUrl: '/mentors/rahul.png' 
    },
    { 
      name: 'Priya Sharma', 
      skill: 'Product Designer at Google', 
      location: 'New Delhi / Remote',
      approach: 'User-centric design systems, emotional aesthetics, and rapid prototyping in Figma.',
      rating: '4.9', 
      sessions: '89', 
      avatarUrl: '/mentors/priya.png' 
    },
    { 
      name: 'Arjun Patel', 
      skill: 'Cloud Solutions Architect', 
      location: 'Mumbai / Worldwide',
      approach: 'Strategic cloud migrations, cost-efficient AWS setups, and high-availability systems.',
      rating: '5.0', 
      sessions: '210', 
      avatarUrl: '/mentors/arjun.png' 
    },
  ];

  const accordionData = [
    { title: 'Web Development', desc: 'Master React & Node.js', icon: <Code size={24} />, color: '#FFADAD', img: '/images/webdev_style.png' },
    { title: 'UI/UX Design', desc: 'Design systems in Figma', icon: <PenTool size={24} />, color: '#FFD6A5', img: '/images/ui_ux_style.jpg' },
    { title: 'Data Science', desc: 'Python & Machine Learning', icon: <TrendingUp size={24} />, color: '#FDFFB6', img: '/images/data_science_style.png' },
    { title: 'Digital Arts', desc: 'Creative illustration', icon: <Palette size={24} />, color: '#CAFFBF', img: '/images/digital_arts_style.png' },
    { title: 'Photography', desc: 'Lightroom mastery', icon: <Camera size={24} />, color: '#9BF6FF', img: '/images/photography_style.jpg' },
    { title: 'Marketing', desc: 'Growth strategies', icon: <Globe size={24} />, color: '#A0C4FF', img: '/images/marketing_style.png' },
    { title: 'Cloud DevOps', desc: 'Docker & AWS', icon: <Zap size={24} />, color: '#BDB2FF', img: '/images/cloud_style.png' },
    { title: 'Copywriting', desc: 'Persuasive writing', icon: <BookOpen size={24} />, color: '#FFC6FF', img: '/images/copywriting_style.png' },
    { title: 'Video Editing', desc: 'Premiere Pro skills', icon: <Star size={24} />, color: '#FFFFFC', img: '/images/video_editing_style.jpg' },
    { title: '3D Modeling', desc: 'Blender texturing', icon: <Users size={24} />, color: '#F1FAEE', img: '/images/3d_modelling_style.png' },
    { title: 'Language Arts', desc: 'Fluent communication', icon: <GraduationCap size={24} />, color: '#A8DADC', img: '/images/language_arts_style.png' },
    { title: 'Finance', desc: 'Personal investing', icon: <TrendingUp size={24} />, color: '#F4A261', img: '/images/finance_style.jpg' },
  ];

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          <GraduationCap size={28} strokeWidth={2} />
          <span>SkillSetu</span>
        </div>
        <div className="nav-links">
          <a href="#how-it-works">How it Works</a>
          <a href="#mentors">Mentors</a>
          <a href="#stats">Impact</a>
          <Link to="/auth" className="btn-secondary">Sign In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-label">
            <Zap size={14} />
            <span>Skill exchange platform for students</span>
          </div>
          <h1 ref={titleRef}>
            Exchange Skills,<br />
            <span className="text-highlight">Not Money.</span>
          </h1>
          <p ref={subtitleRef} className="hero-subtitle">
            A community where knowledge is currency. Teach what you know,
            earn credits, and learn from brilliant minds — all without
            spending a rupee.
          </p>
          <div ref={ctaRef} className="hero-cta">
            <Link to="/auth" className="btn-primary">
              Get Started <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-ghost">
              Learn More
            </a>
          </div>
        </div>

        {/* Floating Stats Bar */}
        <div className="hero-stats container" ref={statsRef}>
          <div className="stat-pill">
            <Users size={16} />
            <span><strong>2,400+</strong> Active Learners</span>
          </div>
          <div className="stat-pill">
            <BookOpen size={16} />
            <span><strong>180+</strong> Skills Listed</span>
          </div>
          <div className="stat-pill">
            <TrendingUp size={16} />
            <span><strong>8,500+</strong> Sessions Completed</span>
          </div>
        </div>

        {/* Subtle Abstract BG */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-label">The Process</div>
          <h2 className="section-title">The Barter System</h2>
          <p className="section-subtitle">Three simple steps to start your learning journey</p>
          <div className="steps-grid">
            <div className="step-card" ref={el => (stepsRef.current[0] = el)}>
              <div className="step-number">01</div>
              <div className="step-image"><img src="/images/teach.png" alt="Teach" /></div>
              <h3>Teach a Skill</h3>
              <p>Share your expertise with eager learners and build your reputation on the platform.</p>
            </div>
            <div className="step-card" ref={el => (stepsRef.current[1] = el)}>
              <div className="step-number">02</div>
              <div className="step-image"><img src="/images/earn.png" alt="Earn" /></div>
              <h3>Earn Credits</h3>
              <p>Get rewarded with platform credits for every session you teach. Your time has value.</p>
            </div>
            <div className="step-card" ref={el => (stepsRef.current[2] = el)}>
              <div className="step-number">03</div>
              <div className="step-image"><img src="/images/learn.png" alt="Learn" /></div>
              <h3>Learn Something New</h3>
              <p>Spend your earned credits to learn new skills from other talented mentors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Discovery Accordion */}
      <section id="explore-skills" className="explore-skills-section">
        <div className="container">
          <div className="section-label">Discover</div>
          <h2 className="section-title">Explore Skills</h2>
          <p className="section-subtitle">Hover to reveal subjects you can barter for today.</p>
          
          <div className="accordion-wrapper">
            {accordionData.map((item, idx) => (
              <div key={idx} className="accordion-card" style={{ backgroundColor: item.color }}>
                {item.img ? (
                  <img src={item.img} alt={item.title} className="accordion-img-bg" />
                ) : (
                  <div className="editorial-motif">
                    <div className="motif-halftone"></div>
                    <div className="motif-shape"></div>
                    <div className="motif-icon-main">{item.icon}</div>
                  </div>
                )}
                <div className="accordion-content">
                  <div className="accordion-icon">{item.icon}</div>
                  <div className="accordion-details">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
                <div className="accordion-vertical-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mentors Section */}
      <section id="mentors" className="featured-mentors">
        <div className="container">
          <div className="section-label">Community</div>
          <h2 className="section-title">Top Mentors</h2>
          <p className="section-subtitle">Learn from the best in the community</p>
          <div className="mentors-list">
            {mentors.map((mentor, idx) => (
              <div key={idx} className="mentor-card-landscape" ref={el => (mentorRefs.current[idx] = el)}>
                <div className="mentor-card-left">
                  <div className="mentor-card-img-wrapper">
                    <img src={mentor.avatarUrl} alt={mentor.name} />
                  </div>
                </div>
                <div className="mentor-card-right">
                  <div className="mentor-info-header">
                    <span className="info-label">Name:</span>
                    <h3 className="mentor-name-title">
                      {mentor.name} <CheckCircle size={16} className="verified-icon" />
                    </h3>
                    <p className="mentor-subheadline">{mentor.skill}</p>
                  </div>
                  
                  <hr className="mentor-divider" />
                  
                  <div className="mentor-location">
                    <MapPin size={16} className="location-pin" />
                    <span>{mentor.location}</span>
                  </div>
                  
                  <hr className="mentor-divider" />
                  
                  <div className="mentor-approach">
                    <span className="info-label">Approach:</span>
                    <p className="approach-text">{mentor.approach}</p>
                  </div>

                  <div className="mentor-card-hover-stats">
                    <Star size={14} fill="currentColor" /> {mentor.rating} • {mentor.sessions} Sessions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="stats" className="impact-section">
        <div className="container">
          <div className="section-label">Impact</div>
          <h2 className="section-title">Our Numbers Speak</h2>
          <p className="section-subtitle">Real results from a real community of learners and mentors.</p>
          <div className="impact-grid">
            <div className="impact-card">
              <Award size={28} />
              <div className="impact-value">98%</div>
              <div className="impact-label">Satisfaction Rate</div>
            </div>
            <div className="impact-card">
              <Users size={28} />
              <div className="impact-value">50+</div>
              <div className="impact-label">Universities</div>
            </div>
            <div className="impact-card">
              <Zap size={28} />
              <div className="impact-value">₹0</div>
              <div className="impact-label">Cost to Learn</div>
            </div>
            <div className="impact-card">
              <TrendingUp size={28} />
              <div className="impact-value">3x</div>
              <div className="impact-label">Faster Growth</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-banner-content">
          <h2>Ready to start bartering?</h2>
          <p>Join thousands of students exchanging skills and growing together.</p>
          <Link to="/auth" className="btn-primary btn-primary-inverted">
            Create Your Profile <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-brand">
                <GraduationCap size={20} /> SkillSetu
              </div>
              <p className="footer-tagline">Where knowledge meets opportunity.</p>
            </div>
            <div className="footer-links">
              <a href="#how-it-works">How it Works</a>
              <a href="#mentors">Mentors</a>
              <a href="#stats">Impact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 SkillSetu Platform. Built collaboratively by Team SkillSetu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
