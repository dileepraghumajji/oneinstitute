'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Phone } from 'lucide-react'
import styles from './CTA.module.css'

function handleMagnet(e) {
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) * 0.25
  const y = (e.clientY - rect.top - rect.height / 2) * 0.25
  btn.style.transform = `translate(${x}px, ${y}px)`
}

function resetMagnet(e) {
  const btn = e.currentTarget
  btn.style.transition = 'transform 400ms ease'
  btn.style.transform = 'translate(0, 0)'
  setTimeout(() => {
    if (btn) {
      btn.style.transition = ''
      btn.style.transform = ''
    }
  }, 400)
}

export default function CTA() {
  const container = useRef()
  const [form, setForm] = useState({ name: '', phone: '', discipline: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useGSAP(() => {
    gsap.from('.cta-anim', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      }
    })
  }, { scope: container })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }))
  }

  function handleBlur(e) {
    const { name, value, required } = e.target
    if (required && !value.trim()) {
      setErrors(prev => ({ ...prev, [name]: true }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!form.name.trim())  newErrors.name = true
    if (!form.phone.trim()) newErrors.phone = true
    if (!form.discipline)   newErrors.discipline = true
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }
    setSubmitted(true)
  }

  return (
    <section className={styles.section} id="contact" ref={container}>
      <div className={styles.inner}>
        <div className={`${styles.left} cta-anim`}>
          <p className={styles.overline}>[+] Join the gym</p>
          <h2 className={styles.headline}>
            WALK-INS<br />
            WELCOME.<br />
            EXCUSES<br />
            AREN'T.
          </h2>
          <p className={styles.sub}>
            First class is on us. Bring wraps, bring attitude. Leave your excuses at the door.
          </p>
        </div>

        <div className={`${styles.right} cta-anim`}>
          {submitted ? (
            <div className={styles.success}>
              <span className={styles.successText}>ROUND ONE CONFIRMED.</span>
              <span className={styles.successSub}>We'll call you.</span>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="cta-name">Name</label>
                <input
                  id="cta-name"
                  name="name"
                  type="text"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="cta-phone">Phone</label>
                <input
                  id="cta-phone"
                  name="phone"
                  type="tel"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="+91 99999 99999"
                  autoComplete="tel"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="cta-discipline">Discipline</label>
                <select
                  id="cta-discipline"
                  name="discipline"
                  className={`${styles.select} ${errors.discipline ? styles.inputError : ''}`}
                  value={form.discipline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">Select a discipline</option>
                  <option value="Boxing">Boxing</option>
                  <option value="Muaythai">Muaythai</option>
                  <option value="Kickboxing K1">Kickboxing K1</option>
                  <option value="Low Kick">Low Kick</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="cta-message">
                  Message <span className={styles.optional}>(optional)</span>
                </label>
                <textarea
                  id="cta-message"
                  name="message"
                  className={styles.textarea}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Anything you want us to know"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                onMouseMove={handleMagnet}
                onMouseLeave={resetMagnet}
              >Book a Class</button>

              <a href="tel:07411074751" className={styles.phone}>
                <span className={styles.phoneDot} />
                <Phone size={16} strokeWidth={1.75} />
                074110 74751
              </a>

              <p className={styles.walkin}>
                Walk-ins accepted · No sign-up fee · All levels
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
