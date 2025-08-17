"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { categoryItems } from "../lib/categoryItem";
import { useState } from "react";

export default function SelectCategory()
{
    const [ selectedCategory, setSelectedCategory ] = useState<string | null>(null);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <input name="category" type="hidden" value={selectedCategory || ""} />
            {categoryItems.map((items) => (
                <div key={items.id} className="cursor-pointer">
                    <Card className={selectedCategory === items.name ? 'border-blue-600 border-2' : 'border-2 border-blue-600/10'} onClick={() => setSelectedCategory(items.name)}>
                        <CardHeader>
                            {items.image}
                            <h3 className="font-medium">{items.title}</h3>
                        </CardHeader>
                    </Card>
                </div>
            ))}
        </div>
    )
}