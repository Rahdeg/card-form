'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { formatCardNumber } from '@/lib/utils'

interface CardData {
  name: string
  number: string
  expiry: { month: string; year: string }
  cvc: string
}

interface FormErrors {
  name?: string
  number?: string
  expiry?: string
  cvc?: string
}



export default function Home() {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    number: '',
    expiry: { month: '', year: '' },
    cvc: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)


  useEffect(() => {
    const savedData = localStorage.getItem('cardFormData')
    if (savedData) {
      setCardData(JSON.parse(savedData))
    }
  }, [])


  useEffect(() => {
    localStorage.setItem('cardFormData', JSON.stringify(cardData))
  }, [cardData])

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!cardData.name.trim()) {
      newErrors.name = "Can't be blank"
    }

    if (!cardData.number.trim()) {
      newErrors.number = "Can't be blank"
    } else if (cardData.number.replace(/\s/g, '').length < 16) {
      newErrors.number = "Wrong format, numbers only"
    }

    if (!cardData.expiry.month || !cardData.expiry.year) {
      newErrors.expiry = "Can't be blank"
    } else if (
      parseInt(cardData.expiry.month) < 1 ||
      parseInt(cardData.expiry.month) > 12 ||
      cardData.expiry.year.length !== 2
    ) {
      newErrors.expiry = "Wrong format"
    }

    if (!cardData.cvc.trim()) {
      newErrors.cvc = "Can't be blank"
    } else if (cardData.cvc.length < 3) {
      newErrors.cvc = "Wrong format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitted(true)
    }
  }

  const handleContinue = () => {
    setIsSubmitted(false)
    setCardData({
      name: '',
      number: '',
      expiry: { month: '', year: '' },
      cvc: ''
    })
    setErrors({})
    localStorage.removeItem('cardFormData')
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'number') {
      value = formatCardNumber(value)
    }

    if (field === 'month' || field === 'year') {
      setCardData(prev => ({
        ...prev,
        expiry: {
          ...prev.expiry,
          [field]: value
        }
      }))
    } else {
      setCardData(prev => ({
        ...prev,
        [field]: value
      }))
    }


    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row relative">

      <div className="relative w-full lg:w-2/5 h-60 lg:h-screen">

        <div className="absolute inset-0">
          <Image
            src="/images/bg-main-mobile.png"
            alt="Background"
            fill
            className="object-cover lg:hidden"
          />
          <Image
            src="/images/bg-main-desktop.png"
            alt="Background"
            fill
            className="object-cover hidden lg:block"
          />
        </div>
      </div>


      <div className="absolute inset-0 z-10 pointer-events-none">

        <div className="lg:hidden">

          <div className="absolute top-8 right-4">
            <div className="relative w-72 h-44 pointer-events-auto">
              <Image
                src="/images/bg-card-back.png"
                alt="Card back"
                fill
                className="object-contain drop-shadow-2xl"
              />

              <div className="absolute top-[4.5rem] right-12 text-white text-sm tracking-wide font-mono">
                {cardData.cvc || '000'}
              </div>
            </div>
          </div>


          <div className="absolute top-32 left-4">
            <div className="relative w-72 h-44 pointer-events-auto">
              <Image
                src="/images/bg-card-front.png"
                alt="Card front"
                fill
                className="object-contain drop-shadow-2xl"
              />


              <div className="absolute top-5 left-6">
                <Image
                  src="/images/card-logo.svg"
                  alt="Card logo"
                  width={54}
                  height={30}
                />
              </div>


              <div className="absolute bottom-14 left-6 text-white text-lg tracking-wider font-mono">
                {cardData.number || '0000 0000 0000 0000'}
              </div>


              <div className="absolute bottom-5 left-6 text-white text-sm flex justify-between items-center w-60">
                <span className="uppercase tracking-wide">
                  {cardData.name || 'Jane Appleseed'}
                </span>
                <span className="tracking-wide">
                  {cardData.expiry.month || '00'}/{cardData.expiry.year || '00'}
                </span>
              </div>
            </div>
          </div>
        </div>


        <div className="hidden lg:block">

          <div className="absolute left-16 top-32">
            <div className="relative w-96 h-52 pointer-events-auto">
              <Image
                src="/images/bg-card-front.png"
                alt="Card front"
                fill
                className="object-contain drop-shadow-2xl"
              />


              <div className="absolute top-6 left-7">
                <Image
                  src="/images/card-logo.svg"
                  alt="Card logo"
                  width={60}
                  height={32}
                />
              </div>

              <div className="absolute bottom-16 left-7 text-white text-[1.5rem] tracking-widest font-mono">
                {cardData.number || '0000 0000 0000 0000'}
              </div>


              <div className="absolute bottom-6 left-7 text-white text-sm flex justify-between items-center w-72">
                <span className="uppercase tracking-wide">
                  {cardData.name || 'Jane Appleseed'}
                </span>
                <span className="tracking-wide">
                  {cardData.expiry.month || '00'}/{cardData.expiry.year || '00'}
                </span>
              </div>
            </div>
          </div>


          <div className="absolute left-20 top-96">
            <div className="relative w-96 h-52 pointer-events-auto">
              <Image
                src="/images/bg-card-back.png"
                alt="Card back"
                fill
                className="object-contain drop-shadow-2xl"
              />


              <div className="absolute top-[5.5rem] right-12 text-white text-base tracking-widest font-mono">
                {cardData.cvc || '000'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-16 pt-32 md:pt-24 lg:pt-16 bg-white relative z-0">
        <div className="w-full max-w-md space-y-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-primary font-medium tracking-wider uppercase text-xs">
                  Cardholder Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Jane Appleseed"
                  value={cardData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`h-12 text-lg ${errors.name ? 'border-destructive focus:border-destructive' : 'focus:ring-2 focus:ring-violet-600 focus:border-violet-600'}`}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="number" className="text-primary font-medium tracking-wider uppercase text-xs">
                  Card Number
                </Label>
                <Input
                  id="number"
                  type="text"
                  placeholder="e.g. 1234 5678 9123 0000"
                  value={cardData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  maxLength={19}
                  className={`h-12 text-lg ${errors.number ? 'border-destructive focus:border-destructive' : 'focus:ring-2 focus:ring-violet-600 focus:border-violet-600'}`}
                />
                {errors.number && <p className="text-destructive text-xs mt-1">{errors.number}</p>}
              </div>

              <div className="flex space-x-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-primary font-medium tracking-wider uppercase text-xs">
                    Exp. Date (MM/YY)
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="MM"
                      value={cardData.expiry.month}
                      onChange={(e) => handleInputChange('month', e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                      maxLength={2}
                      className={`h-12 text-lg text-center ${errors.expiry ? 'border-destructive focus:border-destructive' : 'focus:ring-2 focus:ring-violet-600 focus:border-violet-600'}`}
                    />
                    <Input
                      type="text"
                      placeholder="YY"
                      value={cardData.expiry.year}
                      onChange={(e) => handleInputChange('year', e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                      maxLength={2}
                      className={`h-12 text-lg text-center ${errors.expiry ? 'border-destructive focus:border-destructive' : 'focus:ring-2 focus:ring-violet-600 focus:border-violet-600'}`}
                    />
                  </div>
                  {errors.expiry && <p className="text-destructive text-xs mt-1">{errors.expiry}</p>}
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="cvc" className="text-primary font-medium tracking-wider uppercase text-xs">
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    type="text"
                    placeholder="e.g. 123"
                    value={cardData.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    maxLength={4}
                    className={`h-12 text-lg ${errors.cvc ? 'border-destructive focus:border-destructive' : 'focus:ring-2 focus:ring-violet-600 focus:border-violet-600'}`}
                  />
                  {errors.cvc && <p className="text-destructive text-xs mt-1">{errors.cvc}</p>}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium mt-8"
              >
                Confirm
              </Button>
            </form>
          ) : (

            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <Image
                  src="/images/icon-complete.svg"
                  alt="Success"
                  width={80}
                  height={80}
                />
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-medium text-primary tracking-wider uppercase">
                  Thank You!
                </h1>
                <p className="text-muted-foreground text-lg">
                  We&apos;ve added your card details
                </p>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
