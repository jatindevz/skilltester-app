//src/app/(pages)/dashboard/[flowid]/skills/page.jsx
'use client';
import {
    Search,
    Plus,
    X,
    Code,
    BarChart,
    Globe,
    Database,
    Smartphone,
    Brain,
} from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FullPageLoader } from '@/components/LoadingSpinner';

const SKILL_CATEGORIES = {
    programming: {
        name: 'Programming',
        icon: Code,
        skills: [
            'JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'PHP',
            'Ruby', 'Swift', 'Kotlin', 'C#', 'Scala', 'R', 'MATLAB'
        ]
    },
    webdev: {
        name: 'Web Development',
        icon: Globe,
        skills: [
            'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Next.js', 'Svelte',
            'HTML/CSS', 'Bootstrap', 'Tailwind CSS', 'Webpack', 'Vite', 'GraphQL'
        ]
    },
    mobile: {
        name: 'Mobile Development',
        icon: Smartphone,
        skills: [
            'React Native', 'Flutter', 'iOS Development', 'Android Development',
            'Xamarin', 'Ionic', 'Cordova', 'SwiftUI', 'Kotlin Multiplatform'
        ]
    },
    data: {
        name: 'Data & Analytics',
        icon: BarChart,
        skills: [
            'Data Science', 'Machine Learning', 'SQL', 'MongoDB', 'PostgreSQL',
            'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Apache Spark', 'Hadoop'
        ]
    },
    ai: {
        name: 'AI & Machine Learning',
        icon: Brain,
        skills: [
            'TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning', 'NLP',
            'Computer Vision', 'Reinforcement Learning', 'Neural Networks', 'Keras'
        ]
    },
    cloud: {
        name: 'Cloud & DevOps',
        icon: Database,
        skills: [
            'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
            'Terraform', 'Ansible', 'CI/CD', 'Linux', 'Git', 'GitHub Actions'
        ]
    },
};

// Helper Components
const SkillBadge = ({ skill, onRemove }) => (
    <div className="px-3 py-1 text-sm flex items-center gap-2 bg-[#2E2F2F] text-[#C2D6D6] hover:bg-[#2E2F2F]/80 border border-[#2E2F2F] rounded-full">
        {skill}
        <button
            onClick={() => onRemove(skill)}
            className="text-[#ACBDBA] hover:text-[#A599B5]"
        >
            <X className="h-3 w-3" />
        </button>
    </div>
);

const SkillButton = ({ skill, isSelected, onClick }) => (
    <button
        onClick={() => onClick(skill)}
        className={`p-3 rounded-lg border text-left transition-all w-full ${isSelected
                ? 'bg-[#A599B5]/10 border-[#A599B5]/30 text-[#A599B5]'
                : 'bg-[#051014] border-[#2E2F2F] text-[#C2D6D6] hover:border-[#A599B5]/30 hover:bg-[#2E2F2F]/50 cursor-pointer'
            }`}
    >
        <div className="flex items-center justify-between">
            <span className="font-medium">{skill}</span>
            {isSelected ? (
                <X className="h-4 w-4 text-[#A599B5]" />
            ) : (
                <Plus className="h-4 w-4 text-[#ACBDBA]" />
            )}
        </div>
    </button>
);

const CategoryTabTrigger = ({ categoryKey, category }) => {
    const Icon = category.icon;
    return (
        <TabsTrigger
            value={categoryKey}
            className="flex items-center gap-1 p-3 text-xs text-[#ACBDBA] hover:text-[#A599B5] data-[state=active]:text-[#A599B5] data-[state=active]:bg-[#2E2F2F]"
        >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:block">{category.name.split(' ')[0]}</span>
        </TabsTrigger>
    );
};

// Main Component
export default function SkillsPage() {
    const { flowid } = useParams();
    const router = useRouter();
    const [selectedSkills, setSelectedSkills] = useState(['JavaScript', 'Python']);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('programming');
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const addSkill = useCallback((skill) => {
        if (!selectedSkills.includes(skill)) {
            setSelectedSkills(prev => [...prev, skill]);
        }
    }, [selectedSkills]);

    const removeSkill = useCallback((skill) => {
        setSelectedSkills(prev => prev.filter(s => s !== skill));
    }, []);

    const handleSave = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.post(`/api/createflow/${flowid}/skills`, { skills: selectedSkills });
            if (res.status === 200) {
                toast.success("Skills saved successfully");
                router.push(`/dashboard/${flowid}/quiz`);
            } else {
                toast.error("Failed to save skills");
            }
        } catch (error) {
            toast.error("Server error");
        }
    }, [flowid, selectedSkills, router]);

    const filteredSkills = useCallback((skills) => {
        if (!searchTerm) return skills;
        const term = searchTerm.toLowerCase();
        return skills.filter(skill => skill.toLowerCase().includes(term));
    }, [searchTerm]);

    const handleAddCustomSkill = useCallback(() => {
        if (customSkillInput.trim()) {
            addSkill(customSkillInput.trim());
            setCustomSkillInput('');
        }
    }, [customSkillInput, addSkill]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') handleAddCustomSkill();
    }, [handleAddCustomSkill]);

    // Memoized category tabs content
    const categoryTabs = useMemo(() =>
        Object.entries(SKILL_CATEGORIES).map(([key, category]) => {
            const skills = filteredSkills(category.skills);
            return (
                <TabsContent key={key} value={key}>
                    <Card className="bg-[#051014] border-[#2E2F2F]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#C2D6D6]">
                                <category.icon className="h-5 w-5 text-[#A599B5]" />
                                {category.name}
                            </CardTitle>
                            <CardDescription className="text-[#ACBDBA]">
                                Click on skills to add them to your learning path
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {skills.map((skill) => {
                                    const isSelected = selectedSkills.includes(skill);
                                    return (
                                        <SkillButton
                                            key={skill}
                                            skill={skill}
                                            isSelected={isSelected}
                                            onClick={() => isSelected ? removeSkill(skill) : addSkill(skill)}
                                        />
                                    );
                                })}

                            </div>

                            {skills.length === 0 && searchTerm && (
                                <p className="text-[#ACBDBA]/50 text-center py-8">
                                    No skills found matching "{searchTerm}"
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            );
        }),
        [filteredSkills, selectedSkills, addSkill, removeSkill, searchTerm]);

    if(isLoading) {
        return <FullPageLoader text="Saving..." />
    }
    
    return (
        <div className="p-6 space-y-4 text-white bg-[#051014] min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent">
                    My Skills
                </h1>
                <p className="text-[#ACBDBA] mt-1">
                    Select the skills you want to improve or add new ones to track your progress.
                </p>
            </div>

            {/* Selected Skills */}
            <Card className="bg-[#051014] border-[#2E2F2F]">
                <CardHeader>
                    <CardTitle className="text-[#C2D6D6]">
                        Selected Skills ({selectedSkills.length})
                    </CardTitle>
                    <CardDescription className="text-[#ACBDBA]">
                        These are the skills you're currently tracking
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {selectedSkills.length > 0 ? (
                            selectedSkills.map((skill) => (
                                <SkillBadge
                                    key={skill}
                                    skill={skill}
                                    onRemove={removeSkill}
                                />
                            ))
                        ) : (
                            <p className="text-[#ACBDBA]/50 italic">No skills selected yet</p>
                        )}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button
                            onClick={handleSave}
                            disabled={selectedSkills.length === 0}
                            className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014]"
                        >
                            Save & Continue
                        </Button>
                       
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ACBDBA]/50 h-4 w-4" />
                <Input
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#051014] border-[#2E2F2F] text-[#C2D6D6] placeholder-[#ACBDBA]/50 focus:border-[#A599B5]/30"
                />
            </div>

            {/* Skill Categories */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="grid w-full h-fit p-1 grid-cols-4 lg:grid-cols-8 bg-[#051014] border border-[#2E2F2F]">
                    {Object.entries(SKILL_CATEGORIES).map(([key, category]) => (
                        <CategoryTabTrigger
                            key={key}
                            categoryKey={key}
                            category={category}
                        />
                    ))}
                </TabsList>
                {categoryTabs}
            </Tabs>

            {/* Custom Skill Input */}
            <Card className="bg-[#051014] border-[#2E2F2F]">
                <CardHeader>
                    <CardTitle className="text-[#C2D6D6]">Add Custom Skill</CardTitle>
                    <CardDescription className="text-[#ACBDBA]">
                        Don't see a skill you're looking for? Add it manually.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter skill name..."
                            value={customSkillInput}
                            onChange={(e) => setCustomSkillInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="bg-[#051014] border-[#2E2F2F] text-[#C2D6D6] placeholder-[#ACBDBA]/50 focus:border-[#A599B5]/30"
                        />
                        <Button
                            className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014]"
                            onClick={handleAddCustomSkill}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}