"""
Management command to create sample projects
"""
from django.core.management.base import BaseCommand
from main.models import Project
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Creates sample projects for the portfolio'

    def handle(self, *args, **options):
        # Delete existing sample projects if they exist
        Project.objects.filter(
            title__in=[
                'NFT Marketplace Platform',
                'Corporate Website Redesign',
                'Enterprise Security Audit',
                'Robotic Arm Control System'
            ]
        ).delete()
        
        projects_data = [
            {
                'title': 'NFT Marketplace Platform',
                'classification': 'CLASSIFIED',
                'description': 'A decentralized NFT marketplace built on Ethereum blockchain. Features include smart contract deployment, ERC-721 token standard implementation, gas optimization, and secure wallet integration. The platform enables users to mint, buy, sell, and trade NFTs with minimal transaction fees. Includes advanced filtering, search functionality, and royalty distribution system.',
                'project_type': 'Web3 NFT',
                'technologies': 'Solidity, Web3.js, React, Node.js, Ethereum, IPFS, MetaMask, Hardhat',
                'github_url': 'https://github.com/example/nft-marketplace',
                'live_url': 'https://nft-marketplace.example.com',
                'is_active': True,
            },
            {
                'title': 'Corporate Website Redesign',
                'classification': 'CONFIDENTIAL',
                'description': 'Complete redesign and development of a corporate website with modern UI/UX principles. Implemented responsive design, content management system integration, SEO optimization, and performance enhancements. Features include dynamic content loading, interactive animations, and comprehensive analytics integration. Delivered improved user engagement and conversion rates.',
                'project_type': 'Web2 Website',
                'technologies': 'HTML5, CSS3, JavaScript, React, Django, PostgreSQL, AWS, Docker',
                'github_url': 'https://github.com/example/corporate-website',
                'live_url': 'https://corporate-website.example.com',
                'is_active': True,
            },
            {
                'title': 'Enterprise Security Audit',
                'classification': 'TOP SECRET',
                'description': 'Comprehensive security audit and penetration testing for enterprise infrastructure. Conducted vulnerability assessments, network security analysis, application security testing, and compliance review. Identified critical security flaws and provided remediation strategies. Implemented security hardening measures and continuous monitoring solutions. Ensured compliance with industry standards and regulations.',
                'project_type': 'Security Audit',
                'technologies': 'Penetration Testing, OWASP, Nmap, Burp Suite, Wireshark, Metasploit, Kali Linux, SIEM',
                'github_url': '',
                'live_url': '',
                'is_active': True,
            },
            {
                'title': 'Robotic Arm Control System',
                'classification': 'CLASSIFIED',
                'description': 'Advanced robotic arm control system with precision movement capabilities. Developed real-time control algorithms, inverse kinematics solver, and human-machine interface. Features include path planning, collision detection, force feedback, and remote operation capabilities. Implemented safety protocols and emergency stop mechanisms. Successfully integrated with industrial automation systems.',
                'project_type': 'Robot Arm',
                'technologies': 'Python, C++, ROS, Arduino, Raspberry Pi, Computer Vision, Machine Learning, OpenCV',
                'github_url': 'https://github.com/example/robotic-arm',
                'live_url': '',
                'is_active': True,
            },
        ]
        
        created_count = 0
        for i, project_data in enumerate(projects_data, 1):
            project, created = Project.objects.get_or_create(
                title=project_data['title'],
                defaults={
                    **project_data,
                    'created_date': timezone.now() - timedelta(days=30-i),
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created project: {project.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'→ Project already exists: {project.title}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Successfully created {created_count} projects')
        )

