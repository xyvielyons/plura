'use client'
import { AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import React, { useMemo } from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command'
import { CommandInput } from 'cmdk'
import Link from 'next/link'
interface Props  {
    defaultOpen?:boolean
    subAccounts:SubAccount[]
    sidebarOpt:AgencySidebarOption[] | SubAccountSidebarOption[]
    sidebarLogo:string
    details:any
    user:any
    id:string

}
const MenuOptions = ({defaultOpen,subAccounts,sidebarOpt,sidebarLogo,details,user,id}:Props) => {
    const openState = useMemo(()=>defaultOpen?{open:true}:{},[defaultOpen])

  return (
    <Sheet modal={false} {...openState}>
        <SheetTrigger asChild className='absolute left-4 top-4 z-[100] md:!hidden flex'>
            <Button variant="outline" size={'icon'}><Menu/></Button>
        </SheetTrigger>
        <SheetContent showX={true} side={'left'} className={clsx("bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",{'hidden md:inline-block z-0 w-[300px]':defaultOpen,'inline-block md:hidden z-[100] w-full':!defaultOpen})}>
            <div className="">
                <AspectRatio ratio={16/5}>
                    <Image src={sidebarLogo} alt="Sidebar Logo" fill className="rounded-md object-contain"/>
                </AspectRatio>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className='w-full my-4 flex items-center justify-between py-8' variant="ghost">
                            <div className="flex items-center text-left gap-2">
                                <Compass/>
                                <div className="flex flex-col">
                                    {details.name}
                                    <span>{details.address}</span>
                                </div>
                            </div>
                            <div className="">
                                <ChevronsUpDown size={16} className='text-muted-foreground'></ChevronsUpDown>
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80 h-80 mt-4 z-[200]'>
                        {<Command className='rounded-lg'>
                            <CommandInput placeholder='Search Accounts'></CommandInput>
                            <CommandList>
                                <CommandEmpty>No Results found</CommandEmpty>
                                {(user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") && user?.Agency && 
                                    <CommandGroup heading="Agency">
                                        <CommandItem className='!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all'>
                                            {defaultOpen ? <Link className='flex gap-4 w-full h-full' href={`/agency/${user?.Agency?.id}`}>
                                                <div className="relative w-16">
                                                    <Image src={user?.Agency?.agencyLogo} alt='Agency Logo' fill className='rounded-md object-contain'></Image>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    {user?.Agency?.name}
                                                    <span className='text-muted-foreground'>
                                                        {user?.Agency?.address}
                                                    </span>
                                                </div>
                                            </Link>:(<SheetClose asChild>
                                                <Link className='flex gap-4 w-full h-full' href={`/agency/${user?.Agency?.id}`}>
                                                <div className="relative w-16">
                                                    <Image src={user?.Agency?.agencyLogo} alt='Agency Logo' fill className='rounded-md object-contain'></Image>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    {user?.Agency?.name}
                                                    <span className='text-muted-foreground'>
                                                        {user?.Agency?.address}
                                                    </span>
                                                </div>
                                            </Link>
                                            </SheetClose>)}

                                        </CommandItem>
                                    </CommandGroup>
                                }
                                <CommandGroup heading="Accounts">
                                    {!!subAccounts ? subAccounts.map((subaccount)=>(
                                    <CommandItem key={subaccount.id}>
                                    {defaultOpen ? <Link className='flex gap-4 w-full h-full' href={`/subaccount/${subaccount.id}`}>
                                                <div className="relative w-16">
                                                    <Image src={subaccount.subAccountLogo} alt='subaccount Logo' fill className='rounded-md object-contain'></Image>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    {subaccount.name}
                                                    <span className='text-muted-foreground'>
                                                        {subaccount.address}
                                                    </span>
                                                </div>
                                            </Link>:(<SheetClose asChild>
                                                <Link className='flex gap-4 w-full h-full' href={`/subaccount/${subaccount.id}`}>
                                                <div className="relative w-16">
                                                    <Image src={subaccount.subAccountLogo} alt='subaccount Logo' fill className='rounded-md object-contain'></Image>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    {subaccount.name}
                                                    <span className='text-muted-foreground'>
                                                        {subaccount.address}
                                                    </span>
                                                </div>
                                            </Link>
                                            </SheetClose>)}

                                    </CommandItem> )): <div>
                                        <p>No accounts</p>
                                        </div>}
                                </CommandGroup>
                            </CommandList>

                            {(user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY ADMIN') && (
                                <Button className='w-full flex gap-2'>
                                    <PlusCircleIcon size={15}></PlusCircleIcon>
                                    Create Sub Account
                                </Button>
                            )}
                        </Command>}

                    </PopoverContent>
                </Popover>
            </div>
        </SheetContent>
    </Sheet>
  )
}

export default MenuOptions