'use client'
import { useToast } from '@/hooks/use-toast'
import { Agency } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FileUpload from '../global/file-upload'
import { Switch } from '../ui/switch'
import { NumberInput } from '@tremor/react';
import { deleteAgency, initUser, saveActivityLogsNotification, updateAgencyDetails, upsertAgency } from '@/lib/queries'
import Loading from '../global/loading'
import {v4} from 'uuid'
type Props = {
    data?:Partial<Agency>
}
const formSchema = z.object({
    name:z.string().min(2,{message:"Agency name must be atleast 2 characters"}),
    companyEmail:z.string().min(2,{message:"Agency name must be atleast 2 characters"}),
    companyPhone:z.string().min(2,{message:"Agency name must be atleast 2 characters"}),
    whiteLabel:z.boolean(),
    address:z.string().min(1),
    city:z.string().min(1),
    zipCode:z.string().min(1),
    state:z.string().min(1),
    country:z.string().min(1),
    agencyLogo:z.string().min(1)
  })
const AgencyDetails = ({data}:Props) => {
    const {toast} = useToast()
    const router = useRouter()
    const [deletingAgency,setDeletingAgency] = useState(false)
     // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode:"onChange",
        defaultValues: {
            name:data?.name,
            companyEmail:data?.companyEmail,
            companyPhone:data?.companyPhone,
            whiteLabel:data?.whiteLabel || false,
            address:data?.address,
            city:data?.city,
            zipCode:data?.zipCode,
            state:data?.state,
            country:data?.country,
            agencyLogo:data?.agencyLogo
        },
    })
    const isLoading = form.formState.isSubmitting

    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            let newUserData;
            let customerId;
            if(!data?.id){
                const bodyData = {
                    email:values.companyEmail,
                    name:values.name,
                    shipping:{
                        name:values.name,
                        address:{
                            city:values.city,
                            country:values.country,
                            line1:values.address,
                            postal_code:values.zipCode,
                            state:values.zipCode
                        }
                    },
                    address: {
                        city: values.city,
                        country: values.country,
                        line1: values.address,
                        postal_code: values.zipCode,
                        state: values.zipCode,
                    },
                }
            }
            //WIP custId
            newUserData = await initUser({
                role:'AGENCY_OWNER'
            }) 

            if(!data?.id){
                const response = await upsertAgency({
                    id:data?.id ? data.id : v4(),
                    address:values.address,
                    agencyLogo:values.agencyLogo,
                    city: values.city,
                    companyPhone: values.companyPhone,
                    country: values.country,
                    name: values.name,
                    state: values.state,
                    whiteLabel: values.whiteLabel,
                    zipCode: values.zipCode,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    companyEmail: values.companyEmail,
                    connectAccountId: '',
                    goal: 5

                })
                toast({
                    title:'Created Agency'
                })
                if(data?.id)return router.refresh()
                if(response){
                    return router.refresh()
                }
            }
        }catch(error){
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'could not create your agency',
            })
        }
    }
    const handleDeleteAgency = async ()=>{
        if(!data?.id) return
        setDeletingAgency(true)
        //WIP:discontinue subscription 

        try{
            const response = await deleteAgency(data.id)
            toast({
                title:"Deleted Agency",
                description:"Deleted your agency and all subaccounts"
            })
            router.refresh()
        }catch(error){
            toast({
                variant:"destructive",
                title:'Oppse!',
                description:'Could not delete your agency'
            })
        }
    }


  return (
    <AlertDialog>
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Agency Information</CardTitle>
                <CardDescription>Lets create an agency for your business. You can edit agency settings later from the agency settings tab.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="agencyLogo"
                        disabled={isLoading}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Agency Logo</FormLabel>
                            <FormControl>
                                <FileUpload apiEndPoint="agencyLogo" onChange={field.onChange} value={field.value}></FileUpload>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex md:flex-row gap-4">
                            <FormField
                            control={form.control}
                            name="name"
                            disabled={isLoading}
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                <FormLabel>Agency Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Your Agency Name' {...field}></Input>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="companyEmail"
                            disabled={isLoading}
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                <FormLabel>Agency Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='Email' {...field}></Input>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex md:flex-row gap-4">
                            <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="companyPhone"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <FormLabel>Agency Phone Number</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Phone"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                            <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="whiteLabel"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                                    <div className="">
                                        <FormLabel>Whitelabel Agency</FormLabel>
                                        <FormDescription>Turning on whilelabel mode will show your agency logo to all sub accounts by default. You can overwrite this functionality through sub account settings.</FormDescription>
                                    </div>
                    
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                <Input
                                    placeholder="123 st..."
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="flex md:flex-row gap-4">
                            <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="City"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="State"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <FormLabel>Zipcpde</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Zipcode"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                <Input
                                    placeholder="Country"
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        {data?.id && <div className='flex flex-col gap-2'>
                        <FormLabel>Create A Goal</FormLabel>
                        <FormDescription>✨ Create a goal for your agency. As your business grows your goals grow too so dont forget to set the bar higher!</FormDescription>
                        <NumberInput 
                        defaultValue={data?.goal}
                        onValueChange={async (val:number)=> {
                            if(!data?.id) return
                            await updateAgencyDetails(data.id,{goal:val})
                            await saveActivityLogsNotification({
                                agencyId:data.id,
                                description:`Updated the agency goal to | ${val} Sub Account`,
                                subaccountId:undefined
                            })
                            router.refresh()
                        
                        }}
                        min={1}
                        className='bg-background !border !border-input'
                        placeholder='Sub Account Goal'
                        ></NumberInput>

                        </div>}
                        <Button type="submit" disabled={isLoading} >
                            {isLoading ? <Loading/> :'Save Agency Information'}
                        </Button>
                    </form>
                </Form>
                {data?.id && <div className='flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4'>
                        <div className="">
                            <div className="">Danger Zone</div>
                        </div>
                        <div className="text-muted-foreground">
                            Deleting your agency cannot be undone. This will also delete all
                            sub accounts and all data related to your sub accounts. Sub
                            accounts will no longer have access to funnels, contacts etc.
                        </div>
                            <AlertDialogTrigger 
                            disabled={isLoading || deletingAgency}
                            className='text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap'
                            >{deletingAgency ? 'Deleting....':'Delete Agency'}</AlertDialogTrigger>
                </div>}
                    <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                        This action cannot be undone. This will permanently delete the
                        Agency account and all related sub accounts.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={deletingAgency}
                        className="bg-destructive hover:bg-destructive"
                        onClick={handleDeleteAgency}
                    >
                        Delete
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </CardContent>
        </Card>
    </AlertDialog>
  )
}

export default AgencyDetails